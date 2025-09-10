

import {z} from 'genkit';

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


// Specific types for email payloads
export const WelcomeEmailPayloadSchema = z.object({
  name: z.string().describe('The name of the new user.'),
  to: z.string().email().describe('The email of the new user.'),
});
export type WelcomeEmailPayload = z.infer<typeof WelcomeEmailPayloadSchema>;


export const ConfirmationEmailPayloadSchema = z.object({
  parentName: z.string().describe("The name of the parent registering."),
  studentName: z.string().describe("The name of the student being registered."),
  activityTitle: z.string().describe("The title of the activity."),
  activityDate: z.string().describe("The date of the activity."),
  activityTime: z.string().describe("The time of the activity."),
  activityLocation: z.string().describe("The location of the activity."),
  cost: z.number().optional().describe("The cost of the activity in SAR. If 0 or undefined, it's free."),
  to: z.string().email().describe("The recipient's email address (the parent's email)."),
});
export type ConfirmationEmailPayload = z.infer<typeof ConfirmationEmailPayloadSchema>;


export const GenerateEmailInputSchema = z.object({
  type: z.enum(['welcome', 'confirmation']),
  language: z.enum(['en', 'ar']).describe("The language for the email content."),
  payload: z.union([WelcomeEmailPayloadSchema, ConfirmationEmailPayloadSchema]),
});

export type GenerateEmailInput = z.infer<typeof GenerateEmailInputSchema>;

export const GenerateEmailOutputSchema = z.object({
  subject: z.string().describe('The generated email subject line.'),
  body: z.string().describe('The generated email body in HTML format.'),
  to: z.string().email().describe('The recipient email address.'),
});
export type GenerateEmailOutput = z.infer<typeof GenerateEmailOutputSchema>;
