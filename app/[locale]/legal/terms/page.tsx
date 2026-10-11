import type { Metadata } from "next";
import { canonical } from '@/lib/seo/canonical';
import { hreflangAlternates } from '@/lib/seo/hreflang';

const updated = "October 11, 2026";

type MetadataProps = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: MetadataProps): Promise<Metadata> {
  const path = '/legal/terms';
  const url = canonical(locale, path);
  return {
    title: "AgentOS Terms Guidance",
    description:
      "Summary of licensing and expectations for using the open-source AgentOS runtime.",
    alternates: {
      canonical: url,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title: "AgentOS Terms Guidance",
      description:
        "Summary of licensing and expectations for using the open-source AgentOS runtime.",
      url,
      siteName: 'AgentOS',
      type: 'website',
    },
  };
}

const Sections = [
  {
    title: "License",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          <strong>AgentOS</strong> (<code>@framers/agentos</code>) is distributed under the <strong>Apache License 2.0</strong>.
          It lets you use, reproduce, modify and distribute the software in source or compiled form, and each
          contributor grants a patent license that ends for anyone who sues claiming the software infringes a patent.
          When you distribute it, include a copy of the license, mark the files you changed, and keep the copyright
          and attribution notices.
        </p>
        <p>
          The extension packs in the <code>agentos-extensions</code> registry, the six guardrail packs and the skills
          are under Apache 2.0 as well. <code>@framers/sql-storage-adapter</code>, which AgentOS installs for storage,
          is under the <strong>MIT License</strong>, and so are two older standalone packs on npm,{" "}
          <code>@framers/agentos-ext-http-api</code> and <code>@framers/agentos-ext-tip-ingestion</code>. The license
          field of each package on npm is the authority.
        </p>
        <p>
          Both licenses provide the software &quot;as is&quot;, without warranty of any kind.
        </p>
      </div>
    )
  },
  {
    title: "Self-hosted responsibility",
    body: (
      <p className="text-slate-700 dark:text-slate-200">
        When you deploy AgentOS you operate the stack at your own risk. You are responsible for complying with
        applicable laws, safeguarding user data, and setting your own terms or privacy policies for downstream
        users. The maintainers do not provide service-level agreements for self-hosted deployments.
      </p>
    )
  },
  {
    title: "Marketplace module",
    body: (
      <p className="text-slate-700 dark:text-slate-200">
        AgentOS exports an in-memory <code>Marketplace</code> class for publishing, installing and reviewing agents,
        personas and extensions. It stores prices as data and processes no payments, so a deployment that sells
        through it runs its own payments, payouts and dispute handling.
      </p>
    )
  }
];

export default function TermsPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">Open-source guidance</p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">AgentOS usage notes</h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          This page summarises the practical implications of the Apache 2.0 and MIT licenses and expectations for running the
          AgentOS stack yourself.
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
          Want to contribute back? Check the repository on
          <a href="https://github.com/framerslab/agentos" className="ml-1 font-semibold text-brand hover:underline" target="_blank" rel="noopener noreferrer">GitHub</a>.
        </p>
      </footer>
    </article>
  );
}
