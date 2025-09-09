'use client';

import Image from 'next/image';
import Link from 'next/link';
import Autoplay from "embla-carousel-autoplay"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Activity } from '@/lib/types';
import { useLanguage } from '@/contexts/language-provider';

interface HeroSliderProps {
  activities: Activity[];
}

export function HeroSlider({ activities }: HeroSliderProps) {
  const { t, language } = useLanguage();

  return (
    <Carousel
      className="w-full"
      plugins={[
        Autoplay({
          delay: 5000,
          stopOnInteraction: true,
        }),
      ]}
      opts={{
        loop: true,
        direction: language === 'ar' ? 'rtl' : 'ltr',
      }}
    >
      <CarouselContent className="h-[50vh] md:h-[60vh]">
        {activities.map((activity) => {
          const title = language === 'en' ? activity.title : activity.titleAr;
          const description = language === 'en' ? activity.description : activity.descriptionAr;

          return (
            <CarouselItem key={activity.id}>
              <div className="relative h-full w-full rounded-lg overflow-hidden">
                <Image
                  src={activity.imageUrl}
                  alt={title}
                  fill
                  className="object-cover"
                  data-ai-hint={activity.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white flex flex-col items-start">
                  <Badge variant="secondary" className="mb-2 bg-accent text-accent-foreground">{activity.category}</Badge>
                  <h2 className="text-2xl md:text-4xl font-bold font-headline mb-2">{title}</h2>
                  <p className="text-sm md:text-base text-white/90 mb-4 max-w-prose hidden md:block">
                    {description}
                  </p>
                  <Button asChild className="bg-primary hover:bg-primary/90">
                    <Link href={`/`}>{t('Learn More', 'اعرف المزيد')}</Link>
                  </Button>
                </div>
              </div>
            </CarouselItem>
          );
        })}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </div>
    </Carousel>
  );
}
