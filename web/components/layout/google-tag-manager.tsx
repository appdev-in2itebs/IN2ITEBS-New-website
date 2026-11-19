import Script from "next/script";

/**
 * Google Tag Manager — container GTM-PWV2BPZH.
 *
 * Loaded with strategy="afterInteractive" so it never blocks first paint. The <noscript> iframe
 * belongs immediately after <body> opens and is rendered by GoogleTagManagerNoScript below.
 *
 * The container id is read from NEXT_PUBLIC_GTM_ID where it is set, so a preview deployment can
 * point at a different container (or at none) without a code change. It falls back to the live
 * container. Set NEXT_PUBLIC_GTM_ID to an empty string to disable tagging entirely — which is what
 * a local development machine should do.
 */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-PWV2BPZH";

export function GoogleTagManager() {
  if (!GTM_ID) return null;
  return (
    <Script id="gtm-base" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}

export function GoogleTagManagerNoScript() {
  if (!GTM_ID) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
