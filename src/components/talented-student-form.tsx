
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
import type { TalentedStudent } from "@/lib/types";
import { useLanguage } from "@/contexts/language-provider";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(3, { message: "English name must be at least 3 characters." }),
  nameAr: z.string().min(3, { message: "Arabic name must be at least 3 characters." }),
  grade: z.string().min(2, { message: "English grade is required." }),
  gradeAr: z.string().min(2, { message: "Arabic grade is required." }),
  talent: z.string().min(3, { message: "English talent description is required." }),
  talentAr: z.string().min(3, { message: "Arabic talent description is required." }),
  details: z.string().min(10, { message: "English details must be at least 10 characters." }),
  detailsAr: z.string().min(10, { message: "Arabic details must be at least 10 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }),
  imageHint: z.string().min(2, { message: "Image hint must be at least 2 characters." }),
});

type TalentedStudentFormValues = z.infer<typeof formSchema>;

interface TalentedStudentFormProps {
  student: TalentedStudent | null;
  onSubmit: (values: TalentedStudentFormValues) => void;
  onCancel: () => void;
}

export function TalentedStudentForm({ student, onSubmit, onCancel }: TalentedStudentFormProps) {
  const { t } = useLanguage();

  const form = useForm<TalentedStudentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: student || {
      name: "",
      nameAr: "",
      grade: "",
      gradeAr: "",
      talent: "",
      talentAr: "",
      details: "",
      detailsAr: "",
      imageUrl: "",
      imageHint: "",
    },
  });

  useEffect(() => {
    form.reset(student || {
      name: "",
      nameAr: "",
      grade: "",
      gradeAr: "",
      talent: "",
      talentAr: "",
      details: "",
      detailsAr: "",
      imageUrl: "",
      imageHint: "",
    });
  }, [student, form]);

  const handleSubmit = (values: TalentedStudentFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <ScrollArea className="h-[60vh] pr-6">
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('English Name', 'الاسم بالإنجليزي')}</FormLabel>
                        <FormControl><Input placeholder={t('e.g. John Doe', 'مثال: جون دو')} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="nameAr"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Arabic Name', 'الاسم بالعربي')}</FormLabel>
                        <FormControl><Input placeholder={t('e.g. جون دو', 'مثال: جون دو')} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('English Grade', 'المرحلة بالإنجليزي')}</FormLabel>
                        <FormControl><Input placeholder={t('e.g. Grade 10', 'مثال: Grade 10')} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="gradeAr"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Arabic Grade', 'المرحلة بالعربي')}</FormLabel>
                        <FormControl><Input placeholder={t('e.g. الصف العاشر', 'مثال: الصف العاشر')} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                    control={form.control}
                    name="talent"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Talent (English)', 'الموهبة (إنجليزي)')}</FormLabel>
                        <FormControl><Input placeholder={t('e.g. Painting', 'مثال: Painting')} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="talentAr"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Talent (Arabic)', 'الموهبة (عربي)')}</FormLabel>
                        <FormControl><Input placeholder={t('e.g. الرسم', 'مثال: الرسم')} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Details (English)', 'التفاصيل (إنجليزي)')}</FormLabel>
                        <FormControl><Textarea placeholder={t('Describe the student\'s talent...', 'صف موهبة الطالب...')} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="detailsAr"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Details (Arabic)', 'التفاصيل (عربي)')}</FormLabel>
                        <FormControl><Textarea placeholder={t('صف موهبة الطالب...', 'صف موهبة الطالب...')} {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('Image URL', 'رابط الصورة')}</FormLabel>
                            <FormControl><Input placeholder="https://picsum.photos/400/500" {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageHint"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('Image AI Hint', 'تلميح للصورة (AI)')}</FormLabel>
                            <FormControl><Input placeholder={t('e.g. student portrait', 'مثال: student portrait')} {...field} /></FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
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
