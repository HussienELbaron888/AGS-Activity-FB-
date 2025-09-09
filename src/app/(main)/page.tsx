'use client';

import { useState } from 'react';
import type { Activity, ActivityCategory } from '@/lib/types';
import { activities } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ActivityCard } from '@/components/activity-card';
import { useLanguage } from '@/contexts/language-provider';

const categories: ActivityCategory[] = ['Event', 'Trip', 'Paid', 'Free'];

const categoryTranslations: { [key in ActivityCategory]: { en: string; ar: string } } = {
  Event: { en: 'Events', ar: 'فعاليات' },
  Trip: { en: 'Trips', ar: 'رحلات' },
  Paid: { en: 'Paid', ar: 'مدفوع' },
  Free: { en: 'Free', ar: 'مجاني' },
};

export default function ActivitiesPage() {
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'All'>('All');
  const { t, language } = useLanguage();

  const filteredActivities = activities.filter((activity) => {
    if (selectedCategory === 'All') return true;
    return activity.category === selectedCategory;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            {t('School Activities', 'أنشطة المدرسة')}
          </h1>
          <p className="text-muted-foreground">
            {t('Explore and register for upcoming events, trips, and clubs.', 'استكشف وسجل في الفعاليات والرحلات والنوادي القادمة.')}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('All')}
            className="bg-accent text-accent-foreground hover:bg-accent/90 data-[variant=outline]:bg-card"
          >
            {t('All', 'الكل')}
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="bg-accent text-accent-foreground hover:bg-accent/90 data-[variant=outline]:bg-card"
            >
              {language === 'en' ? categoryTranslations[category].en : categoryTranslations[category].ar}
            </Button>
          ))}
        </div>
      </div>
      
      {filteredActivities.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-medium">{t('No Activities Found', 'لم يتم العثور على أنشطة')}</h3>
            <p className="text-muted-foreground">{t('Try selecting a different category.', 'حاول تحديد فئة مختلفة.')}</p>
        </div>
      )}
    </div>
  );
}
