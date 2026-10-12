import type { Metadata } from "next";
import { canonical } from '@/lib/seo/canonical';
import { hreflangAlternates } from '@/lib/seo/hreflang';

const updated = "October 11, 2026";

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
          AgentOS is released under the <strong>Apache License 2.0</strong>, as are the extension packs in its
          registry, its guardrail packs and its skills. Its storage dependency,{" "}
          <code>@framers/sql-storage-adapter</code>, is under the <strong>MIT License</strong>. The code is public,
          so the guardrail dispatcher, the tool orchestrator and the sandbox that runs agent-written code can be
          read and audited.
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
    title: "Guardrails on input and output",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          The full AgentOS runtime (<code>AgentOS.processRequest</code>) runs the guardrails you register on every
          request. An input guard reads the request before the model does. An output guard reads the final reply,
          and the streamed chunks too when it asks for them. Each guard answers allow, flag, sanitize or block. In
          hold mode (<code>guardrailOutputMode: &apos;hold&apos;</code>) nothing streams to the caller until the
          output guards have judged the whole reply.
        </p>
        <p>
          A guard with <code>failClosed</code> set blocks when it throws or times out. A deployment can also name
          required guards (<code>requiredGuardrails</code>): AgentOS then refuses to start without them, refuses a
          request when one has gone missing, and runs each one fail-closed with a deadline.
        </p>
        <p>
          Guardrails are opt-in. AgentOS exports a phrase-list guard (<code>PhraseListGuardrail</code>) for a
          reviewed list of words, phrases or regular expressions, matched after look-alike letters and invisible
          characters are normalised; a match blocks or goes to an LLM judge. Six guardrail packs install from npm:
          PII redaction, ML classifiers, topicality, code safety, grounding and content-policy rewriting. The{" "}
          <code>agent()</code>, <code>gmi()</code> and <code>agency()</code> helpers accept guardrail ids but do not
          run guards. See the{" "}
          <a
            href="https://docs.agentos.sh/features/guardrails"
            className="font-semibold text-brand hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Guardrails documentation
          </a>{" "}
          for configuration.
        </p>
      </div>
    )
  },
  {
    title: "PII redaction",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          The PII redaction pack (<code>@framers/agentos-ext-pii-redaction</code>) finds email addresses, phone
          numbers, card numbers, government IDs, API keys and other identifiers with regular expressions, plus
          optional NLP, NER-model and LLM-judge tiers for names, places and organisations. On input it replaces
          what it finds before the request reaches the model, and on output it checks the reply. It fails closed:
          when detection throws, the text is blocked instead of passed through.
        </p>
        <p>
          You add the pack to the runtime&apos;s extension manifest, and it then covers every request on that
          runtime. <code>entityTypes</code> picks what it looks for, an allowlist keeps named strings in place,
          and <code>redactionStyle</code> writes each finding as a placeholder, a mask, a hash or a tag.
        </p>
      </div>
    )
  },
  {
    title: "Tool calls",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          On the full AgentOS runtime every tool call passes through the tool orchestrator. It refuses a tool named
          in <code>globalDisabledTools</code>, and it refuses a call when the persona lacks a capability that the
          tool lists in <code>requiredCapabilities</code>. With <code>hitl.enabled</code> set, a tool marked{" "}
          <code>hasSideEffects</code> waits for a human approval, and the call is refused when no approval manager
          is configured.
        </p>
      </div>
    )
  },
  {
    title: "Code an agent writes",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          With <code>emergent: true</code> on the full AgentOS runtime, an agent can write a JavaScript tool
          mid-task. The code has to pass a static check, and an LLM judge reviews the tool before it registers.
          By default the code runs in a <code>node:vm</code> context inside your process with a 5-second limit.
          Node&apos;s documentation says <code>node:vm</code> is not a security mechanism, and AgentOS measures
          that code&apos;s memory without capping it. Network, file-read and hashing functions reach the code
          only when you grant them, with an optional domain allowlist for fetch (checked against the first URL&apos;s
          host) and read roots for files. Writing or deleting files also needs a capability ceiling
          (<code>emergentConfig.capabilities</code>) that grants it.
        </p>
        <p>
          For a stronger boundary, the QuickJS executor runs each call in a fresh WebAssembly instance with a
          memory cap. It needs two optional packages, <code>quickjs-emscripten-core</code> and{" "}
          <code>@jitl/quickjs-wasmfile-release-sync</code>.
        </p>
      </div>
    )
  },
  {
    title: "No data collection by the framework",
    body: (
      <p className="text-slate-700 dark:text-slate-200">
        The AgentOS runtime does not phone home, collect telemetry, or send data to Frame.dev. It sends prompts and
        documents to the services you configure, such as LLM, embedding, speech and search providers, under their
        own policies. Its OpenTelemetry spans are off by default and go only to the exporter your application
        installs. Packs that run a local model, such as the PII pack&apos;s NER tier, download the model files from
        Hugging Face the first time they run.
      </p>
    )
  },
  {
    title: "Prompt injection",
    body: (
      <div className="space-y-3 text-slate-700 dark:text-slate-200">
        <p>
          Injection detection is opt-in. The ML classifiers pack (<code>@framers/agentos-ext-ml-classifiers</code>)
          scores the request and the final reply for toxicity, prompt injection, NSFW content and threats. By
          default it flags a category above 0.5 and blocks above 0.8, and each category takes its own thresholds.
        </p>
        <p>
          The pack scores with the first tier that answers: a local ONNX model (toxic-bert), then an LLM judge if
          you pass one, then keyword patterns. npm installs <code>@huggingface/transformers</code> with the pack as
          an optional dependency, and the ONNX model has no prompt-injection label, so whenever that model is
          available the pack scores injection at 0. The LLM judge and the keyword patterns, which do catch
          injection, run only when the ONNX model cannot load. For a reviewed list of phrases, use the phrase-list
          guard described above.
        </p>
      </div>
    )
  },
  {
    title: "Signed audit trail",
    body: (
      <p className="text-slate-700 dark:text-slate-200">
        The opt-in provenance pack keeps an append-only event log. Each event is hashed into a chain and signed
        with an Ed25519 key, and <code>ChainVerifier</code> reports a sequence gap, a broken link, a changed payload
        or a bad signature.
      </p>
    )
  },
  {
    title: "Dependencies and releases",
    body: (
      <ul className="list-disc space-y-2 pl-5 text-slate-700 dark:text-slate-200">
        <li>
          GitHub&apos;s <strong>Dependabot alerts</strong> are on for the <code>framerslab/agentos</code>{" "}
          repository.
        </li>
        <li>
          A weekly workflow opens a pull request that moves the <code>@framers/*</code> dependencies to their latest
          published versions.
        </li>
        <li>
          Security fixes ship in a new release of the latest published version of <code>@framers/agentos</code>.
          Older versions are not patched.
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
            Report a vulnerability privately through the{" "}
            <a
              href="https://github.com/framerslab/agentos/security/advisories/new"
              className="font-semibold text-brand hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              security advisory form
            </a>{" "}
            on GitHub or by email to{" "}
            <a href="mailto:team@frame.dev" className="font-semibold text-brand hover:underline">
              team@frame.dev
            </a>
            . Do not open a public issue about it.
          </li>
          <li>
            A maintainer acknowledges a report within <strong>5 business days</strong> and sends an assessment and
            a plan within <strong>14 days</strong>.
          </li>
          <li>
            A fix ships before details are published, and the reporter is credited unless they decline. At 90 days
            from the report an advisory is published with the fix, or with mitigations when no fix exists, unless
            the reporter and a maintainer agree on a later date.
          </li>
          <li>
            We will <strong>not take legal action</strong> against researchers who discover and report
            vulnerabilities in good faith.
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
          The controls the open-source AgentOS runtime has, what each one covers, and how to report a
          vulnerability.
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
