export function createEmailLink(event: {
    id: string;
    name: string;
    slug: string;
}) {
    const email = `hello+${event.slug}@creativecontact.vn`;
    const emailSubject = `Upload Files for Event: ${event.name}`;
    const emailBody = `Hi Creative Contact,
  
    I"d like to upload files for the event "${event.name}".`
    return `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
}