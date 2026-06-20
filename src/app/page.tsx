import {
  Activity,
  ArrowRight,
  BarChart3,
  Brain,
  CheckCircle2,
  Gauge,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react";
import { MetricBar } from "@/components/MetricBar";
import { SectionHeading } from "@/components/SectionHeading";
import { StrategyCard } from "@/components/StrategyCard";
import { WaitlistForm } from "@/components/WaitlistForm";

const strategies = [
  {
    icon: ShieldCheck,
    name: "SAFE",
    headline: "Protect the floor",
    description:
      "Prioritizes reliable starters, clean transfer paths, and low volatility picks when your mini-league position matters more than a gamble.",
    accent: "bg-pit-lime/10 text-pit-lime",
  },
  {
    icon: Gauge,
    name: "BALANCED",
    headline: "Optimize upside and control risk",
    description:
      "Blends projected points, value efficiency, and practice movement to find teams that can gain without burning unnecessary transfers.",
    accent: "bg-pit-cyan/10 text-pit-cyan",
  },
  {
    icon: TrendingUp,
    name: "AGGRESSIVE",
    headline: "Chase rank movement",
    description:
      "Surfaces higher-variance combinations, differential drivers, and attack-minded transfer routes for players who need to make up ground.",
    accent: "bg-pit-red/10 text-pit-red",
  },
];

const transparencyItems = [
  {
    icon: BarChart3,
    title: "Projection Breakdown",
    text: "See the score inputs behind every pick: pace, qualifying expectation, race strength, price, and role fit.",
  },
  {
    icon: Target,
    title: "Rejected Alternatives",
    text: "Compare the options the model passed on and understand the tradeoff instead of accepting a black-box answer.",
  },
  {
    icon: Radar,
    title: "Prediction Accuracy",
    text: "Review race-by-race model performance and understand how projections evolve over the season.",
  },
  {
    icon: Brain,
    title: "Driver Decision Analysis",
    text: "Break down driver-versus-driver calls with risk, transfer impact, value, and expected fantasy points.",
  },
];

const socialProofItems = [
  {
    label: "Practice Sessions Analyzed",
    value: "FP1 • FP2 • FP3",
  },
  {
    label: "Transfer Penalty Modeling",
    value: "Included",
  },
  {
    label: "Race-by-Race Validation",
    value: "Every Grand Prix",
  },
  {
    label: "Transparent Recommendations",
    value: "100% Explainable",
  },
];

const practiceSessions = [
  "FP1 establishes the first baseline for team pace, long-run reliability, and setup direction.",
  "FP2 increases confidence in representative race pace and flags drivers outperforming their price.",
  "FP3 tightens the recommendation before qualifying by weighting final setup, consistency, and risk signals.",
];

const comingSoonItems = [
  {
    title: "Team Import",
    text: "Import your current team and evaluate upgrade paths.",
  },
  {
    title: "Captain Optimizer",
    text: "Find the highest-value captain for every race weekend.",
  },
  {
    title: "Transfer Simulator",
    text: "Explore scenarios before spending transfers.",
  },
  {
    title: "Prediction Accuracy Tracking",
    text: "Review historical model performance and improvement.",
  },
  {
    title: "Practice Session Insights",
    text: "Understand how sessions change recommendations.",
  },
  {
    title: "Historical Backtesting",
    text: "Compare projections against real fantasy results.",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden bg-surface-950 text-white">
      <section className="relative min-h-screen px-5 pb-14 pt-6 sm:px-8 lg:px-10">
        <div className="track-grid absolute inset-0 opacity-70" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-pit-cyan/70 to-transparent" />

        <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between py-3">
          <a href="#" className="flex items-center gap-3" aria-label="PitWall Fantasy home">
            <span className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 bg-white/10 shadow-red-glow">
              <Activity aria-hidden className="h-5 w-5 text-pit-red" />
            </span>
            <span className="text-sm font-semibold uppercase tracking-[0.22em] text-white">
              PitWall Fantasy
            </span>
          </a>
          <a
            href="#waitlist"
            className="rounded-md border border-white/10 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-pit-cyan/50 hover:text-white"
          >
            Coming Soon
          </a>
        </nav>

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 pt-16 lg:grid-cols-[1.04fr_0.96fr] lg:pt-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.055] px-3 py-2 text-sm text-slate-300">
              <Sparkles aria-hidden className="h-4 w-4 text-pit-cyan" />
              Explainable F1 Fantasy Optimizer
            </p>
            <h1 className="mt-7 max-w-4xl text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Stop Guessing. Start Gaining Points.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Build better F1 Fantasy teams with transparent AI recommendations powered by practice data, transfer analysis and race-by-race model validation.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#waitlist"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-surface-950 transition hover:bg-pit-cyan"
              >
                Join Waitlist
                <ArrowRight aria-hidden className="h-4 w-4" />
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center rounded-md border border-white/10 bg-white/[0.045] px-5 py-3 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/[0.075]"
              >
                See Features
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-lg border border-white/10 bg-surface-900/80 p-5 shadow-glow backdrop-blur">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                    Monaco GP
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    Recommendation Engine
                  </p>
                </div>
                <span className="rounded-md bg-pit-lime/10 px-3 py-1 text-xs font-semibold text-pit-lime">
                  Live model
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Cost", "Projected", "Risk"].map((label, index) => (
                  <div key={label} className="rounded-md bg-white/[0.045] p-4">
                    <p className="text-xs text-slate-500">{label}</p>
                    <p className="mt-2 font-mono text-xl text-white">
                      {["$98.3m", "95.8", "Low"][index]}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-5">
                <MetricBar label="Expected Points" value="+8.4" width="84%" tone="lime" />
                <MetricBar label="Practice Impact" value="+3.1" width="62%" />
                <MetricBar label="Transfer Impact" value="-0.8" width="28%" tone="red" />
              </div>

              <div className="mt-6 rounded-md border border-pit-cyan/20 bg-pit-cyan/10 p-4">
                <p className="text-sm font-medium text-white">
                  Hadjar edges Ocon after FP2 due to improved long-run pace and stronger value per million.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface-900/70 px-5 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Built for serious F1 Fantasy players
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {socialProofItems.map((item) => (
              <article
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/[0.045] p-6 text-center"
              >
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="mt-3 font-mono text-sm text-pit-cyan">{item.value}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Strategy"
            title="Choose the risk profile that matches your race weekend."
            description="PitWall Fantasy makes recommendations for different competitive contexts, from defending a lead to chasing a league rival."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {strategies.map((strategy) => (
              <StrategyCard key={strategy.name} {...strategy} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-surface-900/70 px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-pit-cyan">
              Explainability
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Every recommendation shows its working.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-300 sm:text-lg">
              Serious fantasy players need more than a lineup. PitWall Fantasy explains why one driver wins the decision and where the model is uncertain.
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5 shadow-glow">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-pit-lime/20 bg-pit-lime/10 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-pit-lime">Selected</p>
                <p className="mt-3 text-3xl font-semibold text-white">Hadjar</p>
              </div>
              <div className="rounded-md border border-white/10 bg-surface-950/70 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-500">Rejected</p>
                <p className="mt-3 text-3xl font-semibold text-slate-300">Ocon</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <MetricBar label="Expected Points" value="42.8 vs 39.1" width="78%" tone="lime" />
              <MetricBar label="Practice Impact" value="+2.7 after FP2" width="58%" />
              <MetricBar label="Risk" value="Medium-low" width="42%" tone="red" />
              <MetricBar label="Value" value="6.3 pts / $m" width="69%" tone="lime" />
              <MetricBar label="Transfer Impact" value="No penalty" width="88%" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Practice Impact"
            title="FP1, FP2 and FP3 become usable fantasy signals."
            description="The model treats practice as new evidence, then adjusts confidence instead of overreacting to a single flashy lap."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {practiceSessions.map((session, index) => (
              <div
                key={session}
                className="rounded-lg border border-white/10 bg-white/[0.045] p-6"
              >
                <p className="font-mono text-sm text-pit-red">FP{index + 1}</p>
                <p className="mt-4 leading-7 text-slate-300">{session}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white/[0.03] px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Model Transparency"
            title="Built for players who want to challenge the model."
            description="PitWall Fantasy is designed to make each recommendation inspectable, comparable, and useful in Discord or Reddit strategy debates."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {transparencyItems.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-white/10 bg-surface-900/80 p-6"
              >
                <item.icon aria-hidden className="h-6 w-6 text-pit-cyan" />
                <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Coming Soon"
            title="What's Coming Next"
            description="The first launch focuses on explainable recommendations, with deeper planning tools coming next."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {comingSoonItems.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-white/10 bg-white/[0.045] p-6"
              >
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 leading-7 text-slate-300">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="waitlist" className="px-5 py-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-lg border border-white/10 bg-surface-900/90 p-6 text-center shadow-red-glow sm:p-10">
          <CheckCircle2 aria-hidden className="mx-auto h-10 w-10 text-pit-lime" />
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Join the PitWall Fantasy waitlist.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Be first to test AI-powered recommendations before the next fantasy race weekend.
          </p>
          <div className="mt-8">
            <WaitlistForm />
          </div>
          <p className="mt-4 text-sm text-slate-500">
            No spam. Only product updates and early access invitations.
          </p>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-semibold text-white">PitWall Fantasy</p>
            <p className="mt-2 max-w-md">
              AI-powered F1 Fantasy optimizer with explainable recommendations.
            </p>
          </div>
          <p>Coming Soon</p>
        </div>
      </footer>
    </main>
  );
}
