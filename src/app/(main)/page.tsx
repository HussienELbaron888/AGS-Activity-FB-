
'use client';

import type { Activity } from '@/lib/types';
import { HeroSlider } from '@/components/hero-slider';
import { useLanguage } from '@/contexts/language-provider';
import { useData } from '@/contexts/data-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, Gift, Plane, Calendar as CalendarIcon, Star, Palmtree, Gamepad2, School } from 'lucide-react';
import React from 'react';
import { ActivityCard } from '@/components/activity-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const categoryDetails = {
    Paid: { icon: DollarSign, t: (t: Function) => t('Paid Activities', 'الأنشطة المدفوعة') },
    Free: { icon: Gift, t: (t: Function) => t('Free Activities', 'الأنشطة المجانية') },
    Trip: { icon: Plane, t: (t: Function) => t('School Trips', 'الرحلات المدرسية') },
    Event: { icon: CalendarIcon, t: (t: Function) => t('School Events', 'الفعاليات المدرسية') },
};


function HomePageContent() {
  const { t, language } = useLanguage();
  const { activities, talentedStudents, registrations } = useData();
  const sliderActivities = activities.filter(a => a.showInSlider);

  const stats = React.useMemo(() => [
    {
      title: t('Paid Activities', 'أنشطة مدفوعة'),
      value: activities.filter(a => a.category === 'Paid').length,
      icon: DollarSign,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: t('Free Activities', 'أنشطة مجانية'),
      value: activities.filter(a => a.category === 'Free').length,
      icon: Gift,
      color: 'bg-green-100 text-green-600',
    },
    {
      title: t('School Trips', 'رحلات مدرسية'),
      value: activities.filter(a => a.category === 'Trip').length,
      icon: Plane,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      title: t('School Events', 'فعاليات مدرسية'),
      value: activities.filter(a => a.category === 'Event').length,
      icon: CalendarIcon,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      title: t('Talented Students', 'طلاب موهوبون'),
      value: talentedStudents.length,
      icon: Star,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      title: t('Total Registrations', 'إجمالي التسجيلات'),
      value: registrations.length,
      icon: Users,
      color: 'bg-red-100 text-red-600',
    },
  ], [t, activities, talentedStudents, registrations]);

  const activitiesByCategory = {
      Paid: activities.filter(a => a.category === 'Paid'),
      Free: activities.filter(a => a.category === 'Free'),
      Trip: activities.filter(a => a.category === 'Trip'),
      Event: activities.filter(a => a.category === 'Event'),
  };

  return (
    <div className="space-y-12">
      <HeroSlider activities={sliderActivities} />

      <div className="container mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
              <CardHeader className="flex flex-col items-center justify-center p-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-sm font-semibold text-muted-foreground">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-2 pt-0">
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {Object.entries(activitiesByCategory).map(([category, categoryActivities]) => {
          if (categoryActivities.length === 0) return null;
          
          const details = categoryDetails[category as keyof typeof categoryDetails];
          const Icon = details.icon;
          const title = details.t(t);

          return (
              <div key={category} className="space-y-6">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                          <h2 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">
                              {title}
                          </h2>
                          <p className="text-muted-foreground">{t('Explore the latest in this category.', 'استكشف أحدث الأنشطة في هذه الفئة.')}</p>
                      </div>
                  </div>
                  
                  <Carousel
                      opts={{
                          align: "start",
                          loop: categoryActivities.length > 4,
                          direction: language === 'ar' ? 'rtl' : 'ltr',
                      }}
                      className="w-full"
                  >
                      <CarouselContent>
                          {categoryActivities.map((activity) => (
                              <CarouselItem key={activity.id} className="sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                  <div className="p-1 h-full">
                                    <ActivityCard activity={activity} />
                                  </div>
                              </CarouselItem>
                          ))}
                      </CarouselContent>
                      <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 -left-4 hidden md:flex" />
                      <CarouselNext className="absolute top-1/2 -translate-y-1/2 -right-4 hidden md:flex" />
                  </Carousel>
              </div>
          );
      })}
    </div>
  );
}


export default function HomePage() {
  return <HomePageContent />;
}
