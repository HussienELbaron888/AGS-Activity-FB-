'use client';

import { Calendar } from "@/components/ui/calendar"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { useLanguage } from "@/contexts/language-provider";

export default function CalendarPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
   const { t } = useLanguage();

  const termCalendars = [
    { name: t("Fall Term Calendar", "تقويم الفصل الدراسي الأول"), href: "#" },
    { name: t("Spring Term Calendar", "تقويم الفصل الدراسي الثاني"), href: "#" },
    { name: t("Summer Term Calendar", "تقويم الفصل الصيفي"), href: "#" },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{t('School Calendar', 'التقويم المدرسي')}</CardTitle>
                <CardDescription>{t('Key dates and events for the academic year.', 'التواريخ والأحداث الرئيسية للعام الدراسي.')}</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
                 <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border p-0"
                    
                />
            </CardContent>
        </Card>
      </div>
      <div>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">{t('Downloads', 'تنزيلات')}</CardTitle>
                <CardDescription>{t('Download term calendars in PDF format.', 'تنزيل تقاويم الفصول الدراسية بصيغة PDF.')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {termCalendars.map((cal, index) => (
                    <Button key={index} variant="outline" className="w-full justify-between" asChild>
                        <a href={cal.href} download>
                            {cal.name}
                            <Download className="h-4 w-4" />
                        </a>
                    </Button>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  )
}
