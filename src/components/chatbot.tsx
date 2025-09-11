
'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageCircle, Bot, User, X, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/language-provider';
import { chat, type ChatInput } from '@/ai/flows/chat-flow';
import type { MessageData } from 'genkit';
import { cn } from '@/lib/utils';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();

  useEffect(() => {
    if (isOpen && messages.length === 0) {
        const welcomeMessage = language === 'ar' 
            ? 'مرحباً! أنا هوبي، مساعدك الذكي. كيف يمكنني مساعدتك اليوم؟'
            : "Hi there! I'm Hubie, your friendly assistant. How can I help you today?";
        setMessages([{ role: 'model', content: [{ text: welcomeMessage }] }]);
    }
  }, [isOpen, language, messages.length]);


  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: MessageData = { role: 'user', content: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const chatInput: ChatInput = { history: newMessages };
      const responseText = await chat(chatInput);
      const modelMessage: MessageData = { role: 'model', content: [{ text: responseText }] };
      setMessages((prevMessages) => [...prevMessages, modelMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorMessage: MessageData = {
        role: 'model',
        content: [{ text: t('Sorry, something went wrong. Please try again.', 'عذراً، حدث خطأ ما. يرجى المحاولة مرة أخرى.') }],
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
                        <CardTitle className="text-lg font-headline">{t('AGS Chatbot', 'شات بوت AGS')}</CardTitle>
                        <CardDescription className="text-xs">{t('Powered by AI', 'مدعوم بالذكاء الاصطناعي')}</CardDescription>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                  <div className="space-y-6">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn(
                          'flex items-start gap-3',
                          message.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                      >
                        {message.role === 'model' && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot size={18} /></AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={cn(
                            'max-w-[80%] rounded-lg px-4 py-2 text-sm whitespace-pre-wrap',
                            message.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          )}
                        >
                          {typeof message.content === 'string'
                            ? message.content
                            : message.content[0].text}
                        </div>
                         {message.role === 'user' && (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback><User size={18} /></AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    ))}
                    {isLoading && (
                       <div className="flex items-start gap-3 justify-start">
                           <Avatar className="h-8 w-8">
                               <AvatarFallback><Bot size={18} /></AvatarFallback>
                           </Avatar>
                           <div className="bg-muted rounded-lg px-4 py-3 flex items-center">
                               <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                           </div>
                       </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardFooter className="border-t p-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex w-full items-center gap-2"
                >
                  <Input
                    type="text"
                    placeholder={t('Type a message...', '...اكتب رسالة')}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={isLoading}>
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </CardFooter>
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

