
/**
 * @fileOverview Type definitions and Zod schemas for the email sending flow.
 * This file centralizes the data structures used for sending confirmation emails,
 * allowing them to be shared between server-side flows and client-side components
 * without violating 'use server' constraints.
 */

import { z } from 'zod';

// Input schema for the activity confirmation email flow
export const ConfirmationEmailInputSchema = z.object({
  to: z.string().email().describe("The recipient's email address."),
  parentName: z.string().describe('The name of the parent.'),
  studentName: z.string().describe('The name of the student.'),
  activityTitle: z.string().describe('The title of the activity.'),
  activityDate: z.string().describe('The date of the activity.'),
  activityTime: z.string().describe('The time of the activity.'),
  activityLocation: z.string().describe('The location of the activity.'),
  cost: z.number().optional().describe('The cost of the activity, if any.'),
});
export type ConfirmationEmailInput = z.infer<typeof ConfirmationEmailInputSchema>;

// Input schema for the welcome email flow
export const WelcomeEmailInputSchema = z.object({
  to: z.string().email().describe("The recipient's email address."),
  name: z.string().describe('The name of the new user.'),
});
export type WelcomeEmailInput = z.infer<typeof WelcomeEmailInputSchema>;


// Generic output schema for all email flows
export const EmailOutputSchema = z.object({
  success: z.boolean().describe('Whether the email was sent successfully.'),
  message: z.string().describe('A message indicating the status of the email sending process.'),
});
export type EmailOutput = z.infer<typeof EmailOutputSchema>;
