'use client';

import Image from 'next/image';
import type { Activity } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/language-provider';

interface ActivityDetailsModalProps {
  activity: Activity;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ActivityDetailsModal({ activity, isOpen, onOpenChange }: ActivityDetailsModalProps) {
  const { language } = useLanguage();
  
  const title = language === 'en' ? activity.title : activity.titleAr;
  const description = language === 'en' ? activity.description : activity.descriptionAr;
  const location = language === 'en' ? activity.location : activity.locationAr;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <div className="relative h-64 w-full rounded-lg overflow-hidden mb-4 -mt-6 -mx-6 sm:mx-0 sm:mt-0">
             <Image src={activity.imageUrl} alt={title} fill className="object-cover" data-ai-hint={activity.imageHint} />
          </div>
          <DialogTitle className="text-2xl font-headline">{title}</DialogTitle>
          <DialogDescription className="text-base">{description}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 text-sm">
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Date</p>
              <p className="text-muted-foreground">{activity.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Time</p>
              <p className="text-muted-foreground">{activity.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Location</p>
              <p className="text-muted-foreground">{location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <DollarSign className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Cost</p>
              <p className="text-muted-foreground">{activity.cost ? `$${activity.cost}` : 'Free'}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-start">
          <Badge variant="secondary" className="bg-accent text-accent-foreground">{activity.category}</Badge>
        </div>
      </DialogContent>
    </Dialog>
  );
}
