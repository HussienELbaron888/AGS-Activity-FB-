'use client';

import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/language-provider';
import { talentedStudents } from '@/lib/data';
import { Star } from 'lucide-react';

export default function TalentedPage() {
  const { t, language } = useLanguage();

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

        {talentedStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {talentedStudents.map((student) => {
              const name = language === 'en' ? student.name : student.nameAr;
              const grade = language === 'en' ? student.grade : student.gradeAr;
              const talent = language === 'en' ? student.talent : student.talentAr;
              const details = language === 'en' ? student.details : student.detailsAr;
              
              return (
                <Card key={student.id} className="flex flex-col overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                  <div className="relative h-60 w-full">
                    <Image
                      src={student.imageUrl}
                      alt={name}
                      fill
                      className="object-cover"
                      data-ai-hint={student.imageHint}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <CardHeader className="absolute bottom-0 text-white">
                      <CardTitle className="font-headline text-2xl">{name}</CardTitle>
                      <CardDescription className="text-white/90">{grade}</CardDescription>
                    </CardHeader>
                  </div>
                  <CardContent className="pt-6 flex-grow flex flex-col">
                    <div className="flex-grow">
                      <Badge variant="secondary" className="mb-3 bg-accent text-accent-foreground inline-flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        {talent}
                      </Badge>
                      <p className="text-muted-foreground text-sm">
                        {details}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <Card>
            <CardHeader>
                <CardTitle>{t('About the Program', 'عن البرنامج')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p>{t('Program details will be announced soon. Stay tuned!', 'سيتم الإعلان عن تفاصيل البرنامج قريبًا. ترقبوا!')}</p>
                 <p className="mt-4 text-sm text-muted-foreground">{t('Admins can add talented students from the dashboard.', 'يمكن للمسؤولين إضافة الطلاب الموهوبين من لوحة التحكم.')}</p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
