
'use client';

import type { Activity } from '@/lib/types';
import { ActivityCard } from '@/components/activity-card';
import { useLanguage } from '@/contexts/language-provider';
import { useData } from '@/contexts/data-provider';

function FreeActivitiesPageContent() {
  const { t } = useLanguage();
  const { activities } = useData();

  const freeActivities = activities.filter((activity) => activity.category === 'Free');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t('Free Activities', 'الأنشطة المجانية')}
        </h1>
        <p className="text-muted-foreground">
          {t('Join our free activities and have fun!', 'انضم إلى أنشطتنا المجانية واستمتع!')}
        </p>
      </div>
      
      {freeActivities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {freeActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-medium">{t('No Free Activities Found', 'لم يتم العثور على أنشطة مجانية')}</h3>
            <p className="text-muted-foreground">{t('Please check back later.', 'يرجى التحقق مرة أخرى لاحقًا.')}</p>
        </div>
      )}
    </div>
  );
}

export default function FreeActivitiesPage() {
  return <FreeActivitiesPageContent />;
}
