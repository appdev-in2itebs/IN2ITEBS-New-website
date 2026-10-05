import { getSettings } from "@/lib/cms/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * The public part of the admin settings: the announcement and the chat widget's look. Pages stay
 * static and fetch this once per visit; Cloudflare may cache it for a minute, so an edit in
 * /admin/settings shows up within about 60 seconds.
 */
export async function GET() {
  const { announcement, chatbot, contact } = await getSettings();
  return Response.json(
    {
      announcement,
      chatbot: {
        enabled: chatbot.enabled,
        name: chatbot.name,
        greeting: chatbot.greeting,
        quickReplies: chatbot.quickReplies,
      },
      contact: { email: contact.email, phone: contact.phone },
    },
    { headers: { "Cache-Control": "public, max-age=30, s-maxage=60" } },
  );
}
