import { fetchEventBySlug } from "@/lib/payload/fetchEvents";
import { fetchEvent } from "@/app/(public)/(event)/api/events/[slug]/helper";
import { getServerTranslation } from "@/lib/i18n/init-server";

export interface EventAboutData {
  title: string;
  body: string;
  igUrl?: string;
  fbUrl?: string;
  ctaText?: string;
  ctaHref?: string;
}

/**
 * Build About dialog data for an event, prioritizing Payload CMS content,
 * then Drizzle event name, then i18n per-slug fallback, finally brand defaults.
 */
export async function getEventAbout(eventSlug: string, lang: string): Promise<EventAboutData> {
  // 1) Try Drizzle projection (preferred: fast and localized if summary_i18n)
  const drizzleEvent = await fetchEvent(eventSlug);
  if (drizzleEvent) {
    const summaryMap = (drizzleEvent as any).summary_i18n as Record<string, string> | null | undefined;
    const body = summaryMap?.[lang] || summaryMap?.en || "";
    return {
      title: drizzleEvent.name,
      body,
      igUrl: undefined,
      fbUrl: undefined,
      ctaText: undefined,
      ctaHref: `/event/${eventSlug}`,
    };
  }

  // 2) Try Payload CMS (if not yet projected)
  const cms = await fetchEventBySlug(eventSlug);
  if (cms) {
    return {
      title: cms.title,
      body: cms.summary || "",
      igUrl: undefined,
      fbUrl: undefined,
      ctaText: undefined,
      ctaHref: `/event/${eventSlug}`,
    };
  }

  // 3) i18n fallback by slug (static JSON safety net)
  const { t } = await getServerTranslation(lang, "EventAbout");
  const keyPrefix = eventSlug;
  const title = t(`${keyPrefix}.title`, { defaultValue: "Creative Contact Event" });
  const body = t(`${keyPrefix}.body`, { defaultValue: "" });
  const ctaText = t(`${keyPrefix}.ctaText`, { defaultValue: undefined as any });
  const igUrl = t(`${keyPrefix}.igUrl`, { defaultValue: undefined as any });
  const fbUrl = t(`${keyPrefix}.fbUrl`, { defaultValue: undefined as any });

  return {
    title,
    body,
    igUrl: typeof igUrl === "string" ? igUrl : undefined,
    fbUrl: typeof fbUrl === "string" ? fbUrl : undefined,
    ctaText: typeof ctaText === "string" ? ctaText : undefined,
    ctaHref: `/event/${eventSlug}`,
  };
}


