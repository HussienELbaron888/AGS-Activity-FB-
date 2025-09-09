
'use client';

import type { Activity } from '@/lib/types';
import { ActivityCard } from '@/components/activity-card';
import { useLanguage } from '@/contexts/language-provider';
import { useData } from '@/contexts/data-provider';

function PaidActivitiesPageContent() {
  const { t } = useLanguage();
  const { activities } = useData();

  const paidActivities = activities.filter((activity) => activity.category === 'Paid');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          {t('Paid Activities', 'الأنشطة المدفوعة')}
        </h1>
        <p className="text-muted-foreground">
          {t('Explore our premium activities.', 'استكشف أنشطتنا المميزة.')}
        </p>
      </div>
      
      {paidActivities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paidActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-medium">{t('No Paid Activities Found', 'لم يتم العثور على أنشطة مدفوعة')}</h3>
            <p className="text-muted-foreground">{t('Please check back later.', 'يرجى التحقق مرة أخرى لاحقًا.')}</p>
        </div>
      )}
    </div>
  );
}

export default function PaidActivitiesPage() {
  return <PaidActivitiesPageContent />;
}
