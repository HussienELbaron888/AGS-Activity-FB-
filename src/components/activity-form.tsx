
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
import { useEffect, useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";

const activityCategories: ActivityCategory[] = ['Event', 'Trip', 'Free', 'Paid'];

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];


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
  sessions: z.coerce.number().min(1, { message: "Sessions must be at least 1." }).optional(),
  imageUrl: z.string().min(1, { message: "An image is required." }),
  imageHint: z.string().optional(),
  showInSlider: z.boolean().default(false).optional(),
  sliderUrl: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal('')),
});

type ActivityFormValues = z.infer<typeof formSchema>;

interface ActivityFormProps {
  activity: Activity | null;
  onSubmit: (values: ActivityFormValues) => void;
  onCancel: () => void;
}

export function ActivityForm({ activity, onSubmit, onCancel }: ActivityFormProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(activity?.imageUrl || null);

  const defaultValues = activity ? {
      ...activity,
      cost: activity.cost || 0,
      sessions: activity.sessions || 1,
      imageHint: activity.imageHint || '',
      showInSlider: activity.showInSlider || false,
      sliderUrl: activity.sliderUrl || '',
  } : {
    title: "",
    titleAr: "",
    description: "",
    descriptionAr: "",
    category: 'Event' as ActivityCategory,
    date: "",
    time: "",
    location: "",
    locationAr: "",
    cost: 0,
    sessions: 1,
    imageUrl: "",
    imageHint: "",
    showInSlider: false,
    sliderUrl: "",
  };

  const form = useForm<ActivityFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  const showInSlider = form.watch("showInSlider");

  useEffect(() => {
    const currentValues = activity ? {
      ...activity,
      cost: activity.cost || 0,
      sessions: activity.sessions || 1,
      imageHint: activity.imageHint || '',
      showInSlider: activity.showInSlider || false,
      sliderUrl: activity.sliderUrl || '',
    } : {
      title: "",
      titleAr: "",
      description: "",
      descriptionAr: "",
      category: 'Event' as ActivityCategory,
      date: "",
      time: "",
      location: "",
      locationAr: "",
      cost: 0,
      sessions: 1,
      imageUrl: "",
      imageHint: "",
      showInSlider: false,
      sliderUrl: "",
    };
    form.reset(currentValues);
    setImagePreview(currentValues.imageUrl);
  }, [activity, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast({
            variant: "destructive",
            title: t("File too large", "الملف كبير جدًا"),
            description: t("Please select an image smaller than 4MB.", "يرجى اختيار صورة أصغر من 4 ميجابايت."),
        });
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        toast({
            variant: "destructive",
            title: t("Invalid file type", "نوع الملف غير صالح"),
            description: t("Please select a JPG, PNG, or WEBP image.", "يرجى اختيار صورة من نوع JPG أو PNG أو WEBP."),
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        form.setValue('imageUrl', dataUrl);
        setImagePreview(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };


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
                                <Input placeholder="09:00 AM - 03:00 PM" {...field} />
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
                
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <FormField
                        control={form.control}
                        name="sessions"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('Number of Sessions', 'عدد الحصص')}</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="1" {...field} />
                            </FormControl>
                            <FormDescription>{t('How many sessions does this activity have?', 'كم عدد حصص هذا النشاط؟')}</FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                 </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('Activity Image', 'صورة النشاط')}</FormLabel>
                            <FormControl>
                                <Input type="file" accept="image/*" onChange={handleImageChange} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            </FormControl>
                             {imagePreview && (
                                <div className="mt-4 relative w-full h-40 rounded-md overflow-hidden border">
                                    <Image src={imagePreview} alt="Image Preview" layout="fill" objectFit="cover" />
                                </div>
                            )}
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="imageHint"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('Image AI Hint', 'تلميح للصورة (AI)')} <span className="text-muted-foreground">({t('Optional', 'اختياري')})</span></FormLabel>
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
                 {showInSlider && (
                    <FormField
                        control={form.control}
                        name="sliderUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>{t('Slider Button URL', 'رابط زر السلايدر')}</FormLabel>
                            <FormControl>
                                <Input placeholder={t('e.g. /gallery', 'مثال: /gallery')} {...field} />
                            </FormControl>
                            <FormDescription>
                                {t('The URL the slider button will link to. Leave empty to link to homepage.', 'الرابط الذي سينقل إليه زر السلايدر. اتركه فارغًا للربط بالصفحة الرئيسية.')}
                            </FormDescription>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                 )}
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
