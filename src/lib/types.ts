export type ActivityCategory = 'Paid' | 'Free' | 'Trip' | 'Event';

export interface Activity {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: ActivityCategory;
  date: string;
  time: string;
  location: string;
  locationAr: string;
  cost?: number;
  imageUrl: string;
  imageHint: string;
}

export type AlbumCategory = 'Events' | 'Trips' | 'Sports' | 'Academics';

export interface Photo {
  id: string;
  url: string;
  alt: string;
  altAr: string;
  hint: string;
}

export interface Album {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: AlbumCategory;
  coverImageUrl: string;
  coverImageHint: string;
  photos: Photo[];
}
