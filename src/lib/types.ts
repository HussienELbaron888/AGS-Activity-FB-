
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
  showInSlider?: boolean;
  sliderUrl?: string;
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

export interface Registration {
    id: string;
    name: string;
    email: string;
    activityId: string;
    registrationDate: string;
    photoURL?: string | null;
}

export interface TalentedStudent {
  id: string;
  name: string;
  nameAr: string;
  grade: string;
  gradeAr: string;
  talent: string;
  talentAr: string;
  details: string;
  detailsAr: string;
  imageUrl: string;
  imageHint: string;
}
