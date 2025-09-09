'use client';

import Image from 'next/image';
import type { Activity } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/language-provider';
import { useState } from 'react';
import { ActivityDetailsModal } from './activity-details-modal';
import { ActivityRegistrationModal } from './activity-registration-modal';

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const { t, language } = useLanguage();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const title = language === 'en' ? activity.title : activity.titleAr;
  const location = language === 'en' ? activity.location : activity.locationAr;

  return (
    <>
      <Card className="flex flex-col overflow-hidden h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
        <div className="relative h-48 w-full">
          <Image
            src={activity.imageUrl}
            alt={title}
            fill
            className="object-cover"
            data-ai-hint={activity.imageHint}
          />
          <Badge variant="secondary" className="absolute top-3 right-3 bg-accent text-accent-foreground">
            {activity.category}
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="font-headline text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{activity.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{location}</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button variant="outline" onClick={() => setIsDetailsOpen(true)}>{t('Details', 'تفاصيل')}</Button>
          <Button onClick={() => setIsRegisterOpen(true)} className="bg-primary hover:bg-primary/90">
            {t('Register', 'تسجيل')}
            {activity.cost ? ` ($${activity.cost})` : ''}
          </Button>
        </CardFooter>
      </Card>
      <ActivityDetailsModal activity={activity} isOpen={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      <ActivityRegistrationModal activity={activity} isOpen={isRegisterOpen} onOpenChange={setIsRegisterOpen} />
    </>
  );
}
