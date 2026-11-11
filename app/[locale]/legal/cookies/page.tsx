import type { Metadata } from "next";
import { canonical } from '@/lib/seo/canonical';
import { hreflangAlternates } from '@/lib/seo/hreflang';

const updated = "November 11, 2026";

type MetadataProps = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: MetadataProps): Promise<Metadata> {
  const path = '/legal/cookies';
  const url = canonical(locale, path);
  return {
    title: "AgentOS Cookie Policy",
    description:
      "How the agentos.sh website uses cookies, analytics, and local storage.",
    alternates: {
      canonical: url,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title: "AgentOS Cookie Policy",
      description:
        "How the agentos.sh website uses cookies, analytics, and local storage.",
      url,
      siteName: 'AgentOS',
      type: 'website',
    },
  };
}

const Sections = [
  {
    title: "What this page covers",
    body: (
      <p className="text-slate-700 dark:text-slate-200">
        This Cookie Policy explains how the <strong>agentos.sh</strong> marketing website uses cookies,
        local storage, and similar technologies. It does <em>not</em> apply to self-hosted deployments of
        the AgentOS runtime, which does not set any cookies or collect analytics on its own.
      </p>
    )
  },
  {
    title: "Cookies and local storage we use",
    body: (
      <div className="space-y-4 text-slate-700 dark:text-slate-200">
        <p>The following table lists all cookies and local storage keys set by agentos.sh:</p>
        <div style={{ overflowX: "auto" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="py-2 pr-4 text-left font-semibold">Key</th>
                <th className="py-2 pr-4 text-left font-semibold">Category</th>
                <th className="py-2 pr-4 text-left font-semibold">Purpose</th>
                <th className="py-2 text-left font-semibold">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2 pr-4"><code>theme</code></td>
                <td className="py-2 pr-4">Functional</td>
                <td className="py-2 pr-4">
                  Stores your light/dark mode preference so the site does not flash on reload.
                </td>
                <td className="py-2">Persistent (localStorage)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code>analytics_consent_purposes</code></td>
                <td className="py-2 pr-4">Strictly necessary</td>
                <td className="py-2 pr-4">
                  Records which analytics purposes you turned on or off, and when.
                </td>
                <td className="py-2">Persistent (localStorage)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code>_ga</code>, <code>_ga_*</code></td>
                <td className="py-2 pr-4">Measurement</td>
                <td className="py-2 pr-4">
                  Google Analytics 4 &mdash; tells visits and sessions apart. Set only after you turn
                  Measurement on.
                </td>
                <td className="py-2">Up to 2 years</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code>_clck</code>, <code>_clsk</code>, <code>CLID</code></td>
                <td className="py-2 pr-4">Session recordings</td>
                <td className="py-2 pr-4">
                  Microsoft Clarity &mdash; session recordings and heatmaps, with all page text masked.
                  Set only after you turn Session recordings on.
                </td>
                <td className="py-2">Session to 1 year</td>
              </tr>
              <tr>
                <td className="py-2 pr-4"><code>ANONCHK</code>, <code>MR</code>, <code>SM</code></td>
                <td className="py-2 pr-4">Session recordings</td>
                <td className="py-2 pr-4">
                  Additional Microsoft Clarity cookies for deduplication, referral tracking, and
                  session management.
                </td>
                <td className="py-2">10 minutes to 7 days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  },
  {
    title: "Your choices",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          On your first visit a bar offers three keys of equal weight: <strong>Reject all</strong>,{" "}
          <strong>Choose</strong> and <strong>Accept all</strong>. Choose shows one switch per purpose, each
          off until you turn it on, and <strong>Save choices</strong>. Nothing from Google or Microsoft
          loads before you answer. Your answer is kept in the <code>analytics_consent_purposes</code> local
          storage key on this device.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Strictly necessary</strong> &mdash; always on. Keeps your choice and your light or dark
            theme on this device.
          </li>
          <li>
            <strong>Measurement</strong> &mdash; off until you turn it on. Loads Google Analytics, which
            counts visits, the pages read and where visitors came from.
          </li>
          <li>
            <strong>Session recordings</strong> &mdash; off until you turn it on. Loads Microsoft Clarity,
            which records clicks and scrolling with all page text masked.
          </li>
        </ul>
        <p>
          If your browser sends Global Privacy Control or Do Not Track, both purposes stay off and the bar
          does not show.
        </p>
      </div>
    )
  },
  {
    title: "Google Analytics",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          Google Analytics 4 loads only after you turn Measurement on. Before that, the site sends nothing
          to Google. We keep Google signals and ad personalisation off, and set every advertising consent
          type to denied. Google processes this data for us as a processor.
        </p>
        <p>
          For more information, see the{" "}
          <a
            href="https://policies.google.com/privacy"
            className="font-semibold text-brand hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Privacy Policy
          </a>
          .
        </p>
      </div>
    )
  },
  {
    title: "Microsoft Clarity",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          Microsoft Clarity loads only after you turn Session recordings on. It records clicks and scrolling
          so we can see where the layout gets in the way, and the page marks all of its text as masked before
          Clarity starts. Microsoft acts as an independent controller of this data under the Clarity terms.
        </p>
        <p>
          Session data is processed by Microsoft and is subject to the{" "}
          <a
            href="https://clarity.microsoft.com/terms"
            className="font-semibold text-brand hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Microsoft Clarity Terms of Service
          </a>
          .
        </p>
      </div>
    )
  },
  {
    title: "No advertising cookies",
    body: (
      <p className="text-slate-700 dark:text-slate-200">
        agentos.sh does not serve advertisements, use retargeting pixels, or set any third-party
        advertising cookies. We do not share browsing data with ad networks.
      </p>
    )
  },
  {
    title: "Managing your preferences",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>You can manage your cookie preferences in several ways:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Analytics choices</strong> &mdash; the <strong>Analytics choices</strong> link in the
            footer of every page reopens the switches. Turning a purpose off there removes its cookies from
            this site and stops it on the next page.
          </li>
          <li>
            <strong>Browser settings</strong> &mdash; most browsers let you block or delete cookies via
            their privacy settings. Refer to your browser&apos;s documentation for instructions.
          </li>
          <li>
            <strong>Google opt-out</strong> &mdash; install the{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              className="font-semibold text-brand hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Analytics Opt-out Browser Add-on
            </a>
            .
          </li>
        </ul>
      </div>
    )
  },
  {
    title: "Updates to this policy",
    body: (
      <p className="text-slate-700 dark:text-slate-200">
        We may update this Cookie Policy from time to time. When we do, we will revise the &quot;Last
        updated&quot; date at the top of this page. We encourage you to review this page periodically.
      </p>
    )
  }
];

export default function CookiesPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          Legal &amp; Compliance
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Cookie Policy
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          How the agentos.sh website uses cookies, local storage, and analytics &mdash; and how you
          control them.
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {updated}</p>
      </header>

      {Sections.map((section) => (
        <section key={section.title} className="glass-panel space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{section.title}</h2>
          {section.body}
        </section>
      ))}

      <footer className="space-y-4 text-sm text-slate-500 dark:text-slate-300">
        <p>
          Questions about cookies or privacy? Contact us at{" "}
          <a href="mailto:team@frame.dev" className="font-semibold text-brand hover:underline">
            team@frame.dev
          </a>
          .
        </p>
      </footer>
    </article>
  );
}
