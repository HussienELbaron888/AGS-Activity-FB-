
'use client';

import type { Activity } from '@/lib/types';
import { activities } from '@/lib/data';
import { ActivityCard } from '@/components/activity-card';
import { useLanguage } from '@/contexts/language-provider';

function TripsPageContent() {
  const { t } = useLanguage();

  const tripActivities = activities.filter((activity) => activity.category === 'Trip');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t('School Trips', 'الرحلات المدرسية')}
        </h1>
        <p className="text-muted-foreground">
          {t('Explore and learn with our exciting school trips.', 'استكشف وتعلم من خلال رحلاتنا المدرسية المثيرة.')}
        </p>
      </div>
      
      {tripActivities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tripActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-medium">{t('No Trips Found', 'لم يتم العثور على رحلات')}</h3>
            <p className="text-muted-foreground">{t('Please check back later for upcoming trips.', 'يرجى التحقق مرة أخرى لاحقًا لمعرفة الرحلات القادمة.')}</p>
        </div>
      )}
    </div>
  );
}

export default function TripsPage() {
  return <TripsPageContent />;
}
