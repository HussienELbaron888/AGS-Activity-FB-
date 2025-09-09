'use client';

import Image from 'next/image';
import type { Album } from '@/lib/types';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Camera, Eye } from 'lucide-react';
import { useLanguage } from '@/contexts/language-provider';

interface AlbumCardProps {
  album: Album;
  onViewAlbum: (album: Album) => void;
}

export function AlbumCard({ album, onViewAlbum }: AlbumCardProps) {
  const { t, language } = useLanguage();
  const title = language === 'en' ? album.title : album.titleAr;

  return (
    <Card className="flex flex-col overflow-hidden h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
      <div className="relative h-48 w-full">
        <Image
          src={album.coverImageUrl}
          alt={title}
          fill
          className="object-cover"
          data-ai-hint={album.coverImageHint}
        />
        <Badge variant="secondary" className="absolute top-3 right-3 bg-accent text-accent-foreground">
          {album.category}
        </Badge>
         <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-white text-xs font-medium">
          <Camera className="h-3 w-3" />
          <span>{album.photos.length} {t('Photos', 'صور')}</span>
        </div>
      </div>
      <CardHeader className="flex-grow">
        <CardTitle className="font-headline text-xl">{title}</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={() => onViewAlbum(album)}>
          <Eye className="mr-2 h-4 w-4" />
          {t('View Album', 'عرض الألبوم')}
        </Button>
      </CardFooter>
    </Card>
  );
}
