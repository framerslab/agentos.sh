import type { Metadata } from "next";
import { canonical } from '@/lib/seo/canonical';
import { hreflangAlternates } from '@/lib/seo/hreflang';

const updated = "March 2026";

type MetadataProps = { params: { locale: string } };

export async function generateMetadata({ params: { locale } }: MetadataProps): Promise<Metadata> {
  const path = '/legal/security';
  const url = canonical(locale, path);
  return {
    title: "AgentOS Security",
    description:
      "Security architecture, guardrails, and responsible disclosure for the open-source AgentOS runtime.",
    alternates: {
      canonical: url,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title: "AgentOS Security",
      description:
        "Security architecture, guardrails, and responsible disclosure for the open-source AgentOS runtime.",
      url,
      siteName: 'AgentOS',
      type: 'website',
    },
  };
}

const Sections = [
  {
    title: "Open-source security model",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          AgentOS Core is released under the <strong>Apache License 2.0</strong> with extensions and
          community agents under the <strong>MIT License</strong>. The entire codebase is publicly available
          for review, audit, and contribution. This transparency means every line of code that handles tool
          execution, credential access, and guardrail enforcement can be independently verified.
        </p>
        <p>
          Security improvements are welcomed through pull requests on{" "}
          <a
            href="https://github.com/framerslab/agentos"
            className="font-semibold text-brand hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    )
  },
  {
    title: "Configurable agent safety",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          AgentOS ships with a configurable security tier system that controls how much autonomy an agent
          is granted. Operators choose one of five named presets when deploying an agent:
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Dangerous</strong> &mdash; no restrictions; intended only for isolated development
            sandboxes where the operator accepts full risk.
          </li>
          <li>
            <strong>Permissive</strong> &mdash; most tools enabled with minimal guardrails. Suitable for
            trusted internal workloads.
          </li>
          <li>
            <strong>Balanced</strong> &mdash; the recommended default. High-risk tools (shell, filesystem)
            require explicit allowlisting; injection detection is active.
          </li>
          <li>
            <strong>Strict</strong> &mdash; only pre-approved tools may execute; all tool calls are logged
            and auditable.
          </li>
          <li>
            <strong>Paranoid</strong> &mdash; the most restrictive tier. Every tool invocation requires
            human-in-the-loop approval before execution. Designed for sensitive or compliance-heavy
            environments.
          </li>
        </ul>
        <p>
          The active tier can be changed at runtime via agent configuration. See the{" "}
          <a
            href="https://docs.agentos.sh/features/guardrails"
            className="font-semibold text-brand hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Guardrails documentation
          </a>{" "}
          for full details.
        </p>
      </div>
    )
  },
  {
    title: "PII redaction guardrails",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          The built-in PII Redaction extension scans inbound and outbound messages for personally
          identifiable information (email addresses, phone numbers, national ID patterns, credit card
          numbers, and more). When detected, PII is masked before the data reaches the LLM provider or
          downstream tool, reducing the risk of accidental data leakage.
        </p>
        <p>
          PII redaction runs as an extension and can be enabled or disabled per agent. Custom regex
          patterns can be added for domain-specific identifiers.
        </p>
      </div>
    )
  },
  {
    title: "Sandboxed tool execution",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          Tools in AgentOS execute within a permission boundary defined by the active security tier. The
          tool orchestrator enforces allowlists, denylists, and rate limits before any tool code runs.
          High-risk tools (filesystem writes, shell commands, network requests) are gated behind explicit
          operator approval at <em>Balanced</em> tier and above.
        </p>
        <p>
          Emergent tools &mdash; tools that agents generate at runtime &mdash; are subject to the same
          security tier restrictions and cannot bypass the allowlist.
        </p>
      </div>
    )
  },
  {
    title: "No data collection by the framework",
    body: (
      <p className="text-slate-700 dark:text-slate-200">
        The AgentOS runtime does not phone home, collect telemetry, or transmit data to Frame.dev or any
        third party. All data processed by AgentOS stays on the infrastructure where it is deployed. If you
        choose to integrate third-party LLM providers, analytics, or storage backends, those services are
        governed by their own privacy policies and are configured entirely by the operator.
      </p>
    )
  },
  {
    title: "Prompt injection defenses",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          AgentOS treats all tool output and external input as untrusted data. The guardrails pipeline
          includes injection and jailbreak detection that analyses messages before they reach the LLM. When
          a potential injection is detected, the request is blocked or flagged for human review, depending
          on the active security tier.
        </p>
        <p>
          Operators can tune detection sensitivity and add custom patterns to match domain-specific attack
          vectors.
        </p>
      </div>
    )
  },
  {
    title: "Dependency security",
    body: (
      <ul className="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-200">
        <li>
          <strong>npm audit</strong> is run as part of CI to catch known vulnerabilities in transitive
          dependencies.
        </li>
        <li>
          <strong>Dependabot</strong> is enabled on the repository for automated dependency update pull
          requests.
        </li>
        <li>
          Security-critical patches are prioritised and released as point versions outside the normal
          release cadence when necessary.
        </li>
      </ul>
    )
  },
  {
    title: "Responsible disclosure",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          We welcome responsible disclosure of security vulnerabilities from researchers and community
          members.
        </p>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            Report vulnerabilities to{" "}
            <a href="mailto:team@frame.dev" className="font-semibold text-brand hover:underline">
              team@frame.dev
            </a>
            .
          </li>
          <li>
            We commit to acknowledging reports within <strong>48 hours</strong> and will work with you to
            understand and resolve the issue.
          </li>
          <li>
            We will <strong>not take legal action</strong> against researchers who discover and report
            vulnerabilities in good faith.
          </li>
          <li>
            Please allow us reasonable time to investigate and remediate before any public disclosure.
          </li>
        </ul>
      </div>
    )
  }
];

export default function SecurityPage() {
  return (
    <article className="space-y-12">
      <header className="space-y-6 text-center">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
          Trust &amp; Safety
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          AgentOS Security
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-300">
          How the open-source AgentOS runtime approaches security, from tiered guardrails to sandboxed
          tool execution.
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
          Questions or concerns about security? Contact us at{" "}
          <a href="mailto:team@frame.dev" className="font-semibold text-brand hover:underline">
            team@frame.dev
          </a>
          .
        </p>
      </footer>
    </article>
  );
}
