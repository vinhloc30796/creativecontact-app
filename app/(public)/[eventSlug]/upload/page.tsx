import { BackgroundDiv } from "@/components/wrappers/BackgroundDiv";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { events } from "@/drizzle/schema/event";
import { db } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import Link from 'next/link';

interface UploadPageProps {
  params: {
    eventSlug: string;
  };
}

function createEmailLink(event: {
  id: string;
  name: string;
  slug: string;
}) {
  const email = `hello+${event.slug}@creativecontact.vn`;
  const emailSubject = `Upload Files for Event: ${event.name}`;
  const emailBody = `Hi Creative Contact,

  I'd like to upload files for the event "${event.name}".`
  return `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
}
async function UploadPage({ params }: UploadPageProps) {
  const { eventSlug } = params;

  // Validate if the eventSlug exists
  const event = await db.query.events.findFirst({
    where: eq(events.slug, eventSlug),
    columns: { id: true, name: true, slug: true }
  });

  if (!event) {
    // Fetch the 3 most recently created events
    const recentEvents = await db.query.events.findMany({
      orderBy: [desc(events.created_at)],
      limit: 3,
      columns: { id: true, name: true, slug: true }
    });

    return (
      <BackgroundDiv>
        <Card className="w-[350px] mx-auto mt-10">
          <CardHeader
            className="border-b aspect-video bg-accent-foreground text-accent-foreground"
            style={{
              backgroundImage: `url(/${eventSlug}-background.png)`,
              backgroundSize: 'cover',
            }}
          >
          </CardHeader>
          <CardContent className='p-6 flex flex-col gap-2'>
            <CardTitle>Event Not Found</CardTitle>
            <p className="mb-4">The event &quot;{eventSlug}&quot; does not exist. Did you mean one of these?</p>
            <div className="space-y-2">
              {recentEvents.map((recentEvent) => (
                <Button key={recentEvent.id} asChild variant="outline" className="w-full">
                  <Link href={`/${recentEvent.slug}/upload`}>
                    {recentEvent.name}
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </BackgroundDiv>
    );
  }

  const emailLink = createEmailLink(event);

  return (
    <BackgroundDiv>
      <Card className="w-[350px] mx-auto mt-10">
        <CardHeader
          className="border-b aspect-video bg-accent-foreground text-accent-foreground"
          style={{
            backgroundImage: `url(/${eventSlug}-background.png)`,
            backgroundSize: 'cover',
          }}
        >
        </CardHeader>
        <CardContent className='p-6 flex flex-col gap-2'>
          <CardTitle>Upload Files</CardTitle>
          <p className="mb-4">Upload files for event: &quot;{event.name}&quot;</p>
          {/* TODO: Implement file upload form and logic */}
          <Button className="w-full" asChild>
            <Link href={emailLink}>Email Us</Link>
          </Button>
        </CardContent>
      </Card>
    </BackgroundDiv>
  );
};

export default UploadPage;
