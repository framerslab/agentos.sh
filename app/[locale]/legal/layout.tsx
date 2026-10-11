import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AgentOS Legal",
  description: "Terms, privacy, security and cookie information for the open-source AgentOS runtime."
};

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  // `relative z-10` puts the legal pages above the global AnimatedBackground
  // canvas (fixed, z-0, mix-blend-mode). Without it the canvas tints text
  // and washes out the page; legal copy needs straight readability.
  return (
    <div className="relative z-10 min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto w-full max-w-4xl px-6 py-20">
        {children}
      </div>
    </div>
  );
}

