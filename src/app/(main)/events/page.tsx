'use client';

import { useMemo } from 'react';
import type { Activity } from '@/lib/types';
import { activities } from '@/lib/data';
import { ActivityCard } from '@/components/activity-card';
import { useLanguage } from '@/contexts/language-provider';

export default function EventsPage() {
  const { t } = useLanguage();

  const eventActivities = useMemo(() => 
    activities.filter((activity) => activity.category === 'Event'), 
    []
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t('School Events', 'الفعاليات المدرسية')}
        </h1>
        <p className="text-muted-foreground">
          {t('Join us for our upcoming school events.', 'انضم إلينا في فعالياتنا المدرسية القادمة.')}
        </p>
      </div>
      
      {eventActivities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-medium">{t('No Events Found', 'لم يتم العثور على فعاليات')}</h3>
            <p className="text-muted-foreground">{t('Please check back later for upcoming events.', 'يرجى التحقق مرة أخرى لاحقًا لمعرفة الفعاليات القادمة.')}</p>
        </div>
      )}
    </div>
  );
}
