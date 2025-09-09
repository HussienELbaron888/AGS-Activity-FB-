'use client';

import Image from 'next/image';
import type { Album } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/language-provider';

interface AlbumDetailsModalProps {
  album: Album | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function AlbumDetailsModal({ album, isOpen, onOpenChange }: AlbumDetailsModalProps) {
  const { language } = useLanguage();

  if (!album) {
    return null;
  }
  
  const title = language === 'en' ? album.title : album.titleAr;
  const description = language === 'en' ? album.description : album.descriptionAr;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-full pr-4 -mr-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                {album.photos.map(photo => {
                    const alt = language === 'en' ? photo.alt : photo.altAr;
                    return (
                        <div key={photo.id} className="relative aspect-[4/3] rounded-lg overflow-hidden group shadow-md">
                           <Image 
                             src={photo.url} 
                             alt={alt}
                             fill
                             className="object-cover transition-transform duration-300 group-hover:scale-105"
                             data-ai-hint={photo.hint}
                           />
                           <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                                <p className="text-white text-sm font-medium">{alt}</p>
                           </div>
                        </div>
                    )
                })}
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
