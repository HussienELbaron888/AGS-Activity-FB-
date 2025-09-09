'use client';

import { useState } from 'react';
import type { Album, AlbumCategory } from '@/lib/types';
import { albums } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { AlbumCard } from '@/components/album-card';
import { AlbumDetailsModal } from '@/components/album-details-modal';
import { useLanguage } from '@/contexts/language-provider';

const categories: AlbumCategory[] = ['Events', 'Trips', 'Sports', 'Academics'];

const categoryTranslations: { [key in AlbumCategory]: { en: string; ar: string } } = {
  Events: { en: 'Events', ar: 'فعاليات' },
  Trips: { en: 'Trips', ar: 'رحلات' },
  Sports: { en: 'Sports', ar: 'رياضة' },
  Academics: { en: 'Academics', ar: 'أكاديمي' },
};

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<AlbumCategory | 'All'>('All');
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const { t, language } = useLanguage();

  const filteredAlbums = albums.filter((album) => {
    if (selectedCategory === 'All') return true;
    return album.category === selectedCategory;
  });

  const handleViewAlbum = (album: Album) => {
    setSelectedAlbum(album);
  };

  const handleCloseModal = () => {
    setSelectedAlbum(null);
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-headline">
              {t('Photo Gallery', 'معرض الصور')}
            </h1>
            <p className="text-muted-foreground">
              {t('Browse through moments captured at our school.', 'تصفح اللحظات التي تم التقاطها في مدرستنا.')}
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
        
        {filteredAlbums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAlbums.map((album) => (
              <AlbumCard key={album.id} album={album} onViewAlbum={handleViewAlbum} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h3 className="text-xl font-medium">{t('No Albums Found', 'لم يتم العثور على ألبومات')}</h3>
              <p className="text-muted-foreground">{t('Try selecting a different category.', 'حاول تحديد فئة مختلفة.')}</p>
          </div>
        )}
      </div>

      <AlbumDetailsModal 
        album={selectedAlbum} 
        isOpen={!!selectedAlbum} 
        onOpenChange={(isOpen) => !isOpen && handleCloseModal()}
      />
    </>
  );
}
