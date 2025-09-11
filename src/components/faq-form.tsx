
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FaqItem } from "@/lib/types";
import { useLanguage } from "@/contexts/language-provider";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect } from "react";

const formSchema = z.object({
  question: z.string().min(5, { message: "English question must be at least 5 characters." }),
  questionAr: z.string().min(5, { message: "Arabic question must be at least 5 characters." }),
  answer: z.string().min(10, { message: "English answer must be at least 10 characters." }),
  answerAr: z.string().min(10, { message: "Arabic answer must be at least 10 characters." }),
});

type FaqFormValues = z.infer<typeof formSchema>;

interface FaqFormProps {
  faqItem: FaqItem | null;
  onSubmit: (values: FaqFormValues) => void;
  onCancel: () => void;
}

export function FaqForm({ faqItem, onSubmit, onCancel }: FaqFormProps) {
  const { t } = useLanguage();

  const form = useForm<FaqFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: faqItem || {
      question: "",
      questionAr: "",
      answer: "",
      answerAr: "",
    },
  });

  useEffect(() => {
    form.reset(faqItem || {
      question: "",
      questionAr: "",
      answer: "",
      answerAr: "",
    });
  }, [faqItem, form]);

  const handleSubmit = (values: FaqFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-6">
                <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('Question (English)', 'السؤال (إنجليزي)')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('e.g. How to register?', 'مثال: How to register?')} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="questionAr"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('Question (Arabic)', 'السؤال (عربي)')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('e.g. كيف أسجل؟', 'مثال: كيف أسجل؟')} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

                <FormField
                    control={form.control}
                    name="answer"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Answer (English)', 'الإجابة (إنجليزي)')}</FormLabel>
                        <FormControl>
                            <Textarea placeholder={t('Provide the answer in English...', 'اكتب الإجابة باللغة الإنجليزية...')} {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="answerAr"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Answer (Arabic)', 'الإجابة (عربي)')}</FormLabel>
                        <FormControl>
                            <Textarea placeholder={t('اكتب الإجابة باللغة العربية...', 'اكتب الإجابة باللغة العربية...')} {...field} rows={5} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
        </ScrollArea>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            {t('Cancel', 'إلغاء')}
          </Button>
          <Button type="submit">{t('Save Changes', 'حفظ التغييرات')}</Button>
        </div>
      </form>
    </Form>
  );
}

    