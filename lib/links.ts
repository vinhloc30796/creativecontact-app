export function createEmailLink(event: {
    id: string;
    name: string;
    slug: string;
    ccEmail?: string;
}) {
    const email = `creative.contact.vn+${event.slug}@gmail.com`
    const ccEmail = event.ccEmail ? `, cc: ${event.ccEmail}` : '';
    const emailSubject = `Upload Files for Event: ${event.name}`;
    const emailBody = `Hi Creative Contact,
  
    I"d like to upload files for the event "${event.name}".`
    return `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}${ccEmail}`;
}