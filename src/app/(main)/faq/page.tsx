import { FaqChat } from '@/components/faq-chat';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function FaqPage() {
  return (
    <div className="flex justify-center items-start h-full">
      <Card className="w-full max-w-3xl h-[75vh]">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-2xl">FAQ Chatbot</CardTitle>
          <CardDescription>Ask me anything about school activities, events, or registration!</CardDescription>
        </CardHeader>
        <FaqChat />
      </Card>
    </div>
  );
}
