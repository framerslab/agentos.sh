import { Mail, MessageCircle, Github } from 'lucide-react';
import { canonical } from '@/lib/seo/canonical';
import { hreflangAlternates } from '@/lib/seo/hreflang';
import { ContactForm } from '@/components/sections/contact-form';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params: { locale } }: Props) {
  const path = '/contact';
  const url = canonical(locale, path);
  return {
    title: 'Contact — AgentOS',
    description:
      'Get in touch with the AgentOS team. We respond to all questions within 1–2 business days. The Wilds AI Discord is the fastest path for support and developer onboarding.',
    alternates: {
      canonical: url,
      languages: hreflangAlternates(path),
    },
    openGraph: {
      title: 'Contact — AgentOS',
      description: 'Get in touch with the AgentOS team.',
      url,
      siteName: 'AgentOS',
      type: 'website',
    },
  };
}

const contactCards = [
  {
    icon: MessageCircle,
    title: 'Discord — fastest support',
    body: 'The Wilds AI Discord is the official community for AgentOS, Paracosm, and Frame projects. Developer onboarding, troubleshooting, feature discussion, and direct access to the core team.',
    href: 'https://wilds.ai/discord',
    cta: 'Join Wilds AI Discord',
    external: true,
  },
  {
    icon: Mail,
    title: 'Email — team@frame.dev',
    body: 'For partnerships, security disclosures, press inquiries, or anything that needs a private channel. Replies in 1–2 business days.',
    href: 'mailto:team@frame.dev',
    cta: 'Email team@frame.dev',
    external: true,
  },
  {
    icon: Github,
    title: 'GitHub Issues — bug reports',
    body: 'For framework bugs, feature requests, or code-level questions. The repo is the canonical place to track engineering work.',
    href: 'https://github.com/framerslab/agentos/issues',
    cta: 'Open an issue',
    external: true,
  },
];

export default function ContactPage() {
  return (
    <main
      id="main-content"
      className="relative overflow-x-hidden bg-[var(--color-background-primary)] text-[var(--color-text-primary)]"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16">
        {/* Hero */}
        <header className="space-y-4 text-center">
          <p className="uppercase tracking-[0.5em] text-xs text-[var(--color-accent-primary)]">
            Get in touch
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight gradient-text">
            Contact AgentOS
          </h1>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
            We respond to every message. For real-time help, join the Wilds AI Discord — it&apos;s the official AgentOS and Paracosm support and developer-onboarding channel.
          </p>
        </header>

        {/* Channel cards */}
        <section
          className="grid gap-6 md:grid-cols-3"
          aria-label="Contact channels"
        >
          {contactCards.map((card) => {
            // Mailto + tel links must open in the same tab so the browser
            // hands off to the OS mail/phone client. target="_blank" can
            // produce a blank tab that never closes (Chrome/Safari).
            const isProtocolLink = card.href.startsWith('mailto:') || card.href.startsWith('tel:');
            const shouldOpenInNewTab = card.external && !isProtocolLink;
            return (
            <a
              key={card.title}
              href={card.href}
              target={shouldOpenInNewTab ? '_blank' : undefined}
              rel={shouldOpenInNewTab ? 'noopener noreferrer' : undefined}
              className="group flex flex-col gap-4 rounded-2xl border border-[var(--color-border-subtle)]/60 bg-white/70 dark:bg-white/5 p-6 transition-all hover:border-[var(--color-accent-primary)]/60 hover:bg-[var(--color-accent-primary)]/5 hover:translate-y-[-2px]"
            >
              <card.icon
                className="h-8 w-8 text-[var(--color-accent-primary)]"
                aria-hidden="true"
              />
              <div>
                <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
                  {card.title}
                </h2>
                <p className="mt-2 text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {card.body}
                </p>
              </div>
              <span className="mt-auto text-sm font-semibold text-[var(--color-accent-primary)] group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                {card.cta}
                <span aria-hidden="true">→</span>
              </span>
            </a>
          );
          })}
        </section>

        {/* Form */}
        <section
          className="rounded-[32px] border border-[var(--color-border-subtle)]/60 bg-white/70 dark:bg-white/5 p-8 sm:p-10 shadow-2xl shadow-black/5"
          aria-label="Contact form"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
              Send us a message
            </h2>
            <p className="mt-2 text-[var(--color-text-secondary)]">
              For partnerships, press, security, or anything that needs a written record. Goes to{' '}
              <a
                href="mailto:team@frame.dev"
                className="font-semibold text-[var(--color-accent-primary)] hover:underline"
              >
                team@frame.dev
              </a>
              .
            </p>
          </div>
          <ContactForm />
        </section>
      </div>
    </main>
  );
}
