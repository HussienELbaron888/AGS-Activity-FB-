'use client';

import type { Activity } from '@/lib/types';
import { activities } from '@/lib/data';
import { ActivityCard } from '@/components/activity-card';
import { useLanguage } from '@/contexts/language-provider';

export default function ActivitiesPage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {t('All School Activities', 'جميع أنشطة المدرسة')}
          </h1>
          <p className="text-muted-foreground">
            {t('Explore and register for upcoming events, trips, and clubs.', 'استكشف وسجل في الفعاليات والرحلات والنوادي القادمة.')}
          </p>
        </div>
      </div>
      
      {activities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-medium">{t('No Activities Found', 'لم يتم العثور على أنشطة')}</h3>
            <p className="text-muted-foreground">{t('Please check back later.', 'يرجى التحقق مرة أخرى لاحقًا.')}</p>
        </div>
      )}
    </div>
  );
