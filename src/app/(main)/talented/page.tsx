'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from '@/contexts/language-provider';

export default function TalentedPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
        <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
            {t('Talented Students Program', 'برنامج الطلاب الموهوبين')}
            </h1>
            <p className="text-muted-foreground">
            {t('Nurturing the future leaders and innovators.', 'رعاية قادة ومبدعي المستقبل.')}
            </p>
        </div>
        <Card>
            <CardHeader>
                <CardTitle>{t('About the Program', 'عن البرنامج')}</CardTitle>
                <CardDescription>
                {t(
                    'Our Talented Students Program is designed to identify and support students with exceptional abilities in various fields, providing them with advanced learning opportunities and mentorship.',
                    'تم تصميم برنامج الطلاب الموهوبين لدينا لتحديد ودعم الطلاب ذوي القدرات الاستثنائية في مختلف المجالات، وتزويدهم بفرص تعلم متقدمة وإرشاد.'
                )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>{t('Program details will be announced soon. Stay tuned!', 'سيتم الإعلان عن تفاصيل البرنامج قريبًا. ترقبوا!')}</p>
            </CardContent>
        </Card>
    </div>
  );
}
