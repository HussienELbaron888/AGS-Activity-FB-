
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Activity, ActivityCategory } from "@/lib/types";
import { useLanguage } from "@/contexts/language-provider";
import { ScrollArea } from "./ui/scroll-area";
import { useEffect } from "react";
import { Checkbox } from "./ui/checkbox";

const activityCategories: ActivityCategory[] = ['Event', 'Trip', 'Free', 'Paid'];

const formSchema = z.object({
  title: z.string().min(3, { message: "English title must be at least 3 characters." }),
  titleAr: z.string().min(3, { message: "Arabic title must be at least 3 characters." }),
  description: z.string().min(10, { message: "English description must be at least 10 characters." }),
  descriptionAr: z.string().min(10, { message: "Arabic description must be at least 10 characters." }),
  category: z.enum(activityCategories),
  date: z.string().min(1, { message: "Date is required." }),
  time: z.string().min(1, { message: "Time is required." }),
  location: z.string().min(3, { message: "English location is required." }),
  locationAr: z.string().min(3, { message: "Arabic location is required." }),
  cost: z.coerce.number().min(0).optional(),
  imageUrl: z.string().url({ message: "Please enter a valid image URL." }),
  imageHint: z.string().min(2, { message: "Image hint must be at least 2 characters." }),
  showInSlider: z.boolean().default(false).optional(),
});

type ActivityFormValues = z.infer<typeof formSchema>;

interface ActivityFormProps {
  activity: Activity | null;
  onSubmit: (values: ActivityFormValues) => void;
  onCancel: () => void;
}

export function ActivityForm({ activity, onSubmit, onCancel }: ActivityFormProps) {
  const { t } = useLanguage();

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: activity || {
      title: "",
      titleAr: "",
      description: "",
      descriptionAr: "",
      category: 'Event',
      date: "",
      time: "",
      location: "",
      locationAr: "",
      cost: 0,
      imageUrl: "",
      imageHint: "",
      showInSlider: false,
    },
  });

  useEffect(() => {
    form.reset(activity || {
      title: "",
      titleAr: "",
      description: "",
      descriptionAr: "",
      category: 'Event',
      date: "",
      time: "",
      location: "",
      locationAr: "",
      cost: 0,
      imageUrl: "",
      imageHint: "",
      showInSlider: false,
    });
  }, [activity, form]);

  const handleSubmit = (values: ActivityFormValues) => {
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
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('English Title', 'العنوان بالإنجليزي')}</FormLabel>
                        <FormControl>
                            <Input placeholder={t('e.g. Science Fair', 'مثال: معرض العلوم')} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="titleAr"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Arabic Title', 'العنوان بالعربي')}</FormLabel>
                        <FormControl>
                            <Input placeholder={t('e.g. معرض العلوم', 'مثال: معرض العلوم')} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('English Description', 'الوصف بالإنجليزي')}</FormLabel>
                        <FormControl>
                            <Textarea placeholder={t('Describe the activity...', 'صف النشاط...')} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="descriptionAr"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Arabic Description', 'الوصف بالعربي')}</FormLabel>
                        <FormControl>
                            <Textarea placeholder={t('صف النشاط...', 'صف النشاط...')} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('Category', 'الفئة')}</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder={t('Select a category', 'اختر فئة')} />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {activityCategories.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('Date', 'التاريخ')}</FormLabel>
                            <FormControl>
                                <Input placeholder="YYYY-MM-DD" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('Time', 'الوقت')}</FormLabel>
                            <FormControl>
                                <Input placeholder="HH:MM - HH:MM" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('English Location', 'الموقع بالإنجليزي')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('e.g. Main Auditorium', 'مثال: القاعة الرئيسية')} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="locationAr"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('Arabic Location', 'الموقع بالعربي')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('e.g. القاعة الرئيسية', 'مثال: القاعة الرئيسية')} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                 <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('Cost (SAR)', 'التكلفة (ر.س)')}</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="0" {...field} />
                        </FormControl>
                        <FormDescription>{t('Leave 0 for free activities.', 'اترك 0 للأنشطة المجانية.')}</FormDescription>
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
                            <FormControl>
                                <Input placeholder="https://picsum.photos/600/400" {...field} />
                            </FormControl>
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
                            <FormControl>
                                <Input placeholder={t('e.g. science experiment', 'مثال: تجربة علمية')} {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                 <FormField
                    control={form.control}
                    name="showInSlider"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                            <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>
                            {t('Show in Hero Slider', 'عرض في السلايدر الرئيسي')}
                            </FormLabel>
                            <FormDescription>
                            {t('Check this to feature this activity on the homepage slider.', 'حدد هذا الخيار لعرض هذا النشاط في السلايدر بالصفحة الرئيسية.')}
                            </FormDescription>
                        </div>
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
