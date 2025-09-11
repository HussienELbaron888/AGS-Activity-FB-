
'use client';

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, MessageCircle, Bot, X, FileQuestion } from 'lucide-react';
import { useLanguage } from '@/contexts/language-provider';
import { useData } from '@/contexts/data-provider';
import type { FaqItem } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { t, language } = useLanguage();
  const { faqItems } = useData();

  const filteredFaqs = useMemo(() => {
    if (!searchTerm) {
      return faqItems;
    }
    return faqItems.filter(faq =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.questionAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answerAr.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, faqItems]);

  const getQuestion = (faq: FaqItem) => language === 'en' ? faq.question : faq.questionAr;
  const getAnswer = (faq: FaqItem) => language === 'en' ? faq.answer : faq.answerAr;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              "fixed bottom-24 z-50 w-[calc(100%-2rem)] max-w-sm sm:w-full",
              language === 'ar' ? 'left-4' : 'right-4'
            )}
          >
            <Card className="flex h-[70vh] flex-col shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between border-b">
                <div className='flex items-center gap-3'>
                    <Avatar className='h-10 w-10 border-2 border-primary'>
                        <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-lg font-headline">{t('Help Center', 'مركز المساعدة')}</CardTitle>
                        <CardDescription className="text-xs">{t('Find answers instantly', 'ابحث عن إجابات فورية')}</CardDescription>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-4 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder={t('Search questions...', '...ابحث عن سؤال')}
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ScrollArea className="flex-1">
                  {filteredFaqs.length > 0 ? (
                      <Accordion type="single" collapsible className="w-full">
                        {filteredFaqs.map((faq) => (
                           <AccordionItem value={faq.id} key={faq.id}>
                                <AccordionTrigger>{getQuestion(faq)}</AccordionTrigger>
                                <AccordionContent className="whitespace-pre-wrap text-muted-foreground">
                                    {getAnswer(faq)}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                      </Accordion>
                  ) : (
                    <div className="text-center py-10">
                        <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground/50" />
                        <h3 className="mt-4 text-lg font-medium">{t('No results found', 'لم يتم العثور على نتائج')}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {t('Try searching for something else.', 'جرّب البحث عن شيء آخر.')}
                        </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        className={cn(
            'fixed bottom-6 z-40 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110',
            language === 'ar' ? 'left-6' : 'right-6'
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <AnimatePresence mode="wait">
            <motion.div
                key={isOpen ? 'close' : 'open'}
                initial={{ opacity: 0, rotate: -45, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.5 }}
                transition={{ duration: 0.2 }}
            >
                {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
            </motion.div>
        </AnimatePresence>
      </Button>
    </>
  );
}

// Simple Avatar component for internal use
const Avatar = ({children, className}: {children: React.ReactNode, className?: string}) => (
    <div className={cn("flex items-center justify-center rounded-full bg-muted", className)}>
        {children}
    </div>
);

const AvatarFallback = ({children}: {children: React.ReactNode}) => <>{children}</>;

    