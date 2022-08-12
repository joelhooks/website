import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { trackPageView } from "../utils/tracking";
import { useAnonId } from "../shared/trackingHooks";
import "../styles/globals.css";

import PageBanner from "../shared/PageBanner";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { anonId, existing } = useAnonId();

  useEffect(() => {
    if (pageProps.htmlClassName) {
      document.getElementsByTagName("html")[0].className =
        pageProps.htmlClassName;
    }
  });
  useEffect(() => {
    const handleRouteChange = (url) => {
      // Track page views when using Next's Link component as it doesn't do a full refresh
      trackPageView(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  const metaTitle =
    pageProps?.meta?.title || "You Send Events. We Run Your Code.";
  // Warn during local dev
  if (!pageProps?.meta?.title && process.env.NODE_ENV !== "production") {
    console.warn(
      "WARNING: meta tags are not set for this page, please set via getStaticProps"
    );
  }

  return (
    <>
      <Head>
        <title>Inngest → {metaTitle}</title>
        <meta property="og:title" content={`Inngest - ${metaTitle}`} />
        {pageProps?.meta?.description && (
          <>
            <meta
              name="description"
              content={pageProps.meta.description}
            ></meta>
            <meta
              property="og:description"
              content={pageProps.meta.description}
            />
          </>
        )}
        <meta
          property="og:image"
          content={pageProps?.meta?.image || "/assets/img/og-image-default.jpg"}
        />
        <meta
          property="og:url"
          content={`https://www.inngest.com${router.pathname}`}
        />
      </Head>
      <PageBanner href="/docs/guides/prisma-background-jobs?ref=page-banner">
        New Guide: Running Background Jobs with Prisma ORM + TypeScript
      </PageBanner>
      <Component {...pageProps} />
      <Script
        id="js-inngest-sdk-script"
        strategy="afterInteractive"
        src="/inngest-sdk.js"
        onLoad={() => {
          Inngest.init(process.env.NEXT_PUBLIC_INNGEST_KEY);
          Inngest.identify({ anonymous_id: anonId });
          // The hook should tell us if the anon id is an existing one, or it's just been set
          const firstTouch = !existing;
          let ref = null;
          try {
            const urlParams = new URLSearchParams(window.location.search);
            ref = urlParams.get("ref");
          } catch (e) {}
          // See tracking for next/link based transitions in tracking.ts
          Inngest.event({
            name: "website/page.viewed",
            data: {
              first_touch: firstTouch,
              ref: ref,
            },
          });
          if (typeof window !== "undefined" && window._inngestQueue.length) {
            window._inngestQueue.forEach((p) => {
              // Prevent the double tracking of page views b/c routeChangeComplete
              // is unpredictable.
              if (p.name === "website/page.viewed") return;
              Inngest.event(p);
            });
          }
        }}
      />
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GTAG_ID}`}
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GTAG_ID}');
      `,
        }}
      />
    </>
  );
}

export default MyApp;
