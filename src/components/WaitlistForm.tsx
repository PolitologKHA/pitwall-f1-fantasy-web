"use client";

import { Check, Mail } from "lucide-react";
import { FormEvent, useState } from "react";

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      if (!response.ok) {
        throw new Error("Waitlist submission failed.");
      }

      setEmail(normalizedEmail);
      setSubmitted(true);
    } catch {
      setError("We could not save your email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-pit-lime/30 bg-pit-lime/10 p-5 text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-pit-lime text-surface-950">
            <Check aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <p className="font-semibold text-white">You are on the F1 DecisionIQ waitlist.</p>
            <p className="mt-1 text-sm text-slate-300">
              We will send early access updates to {email}.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <label className="relative flex-1">
        <span className="sr-only">Email address</span>
        <Mail
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500"
        />
        <input
          required
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="h-14 w-full rounded-md border border-white/10 bg-surface-950/80 py-4 pl-12 pr-4 text-base text-white outline-none transition placeholder:text-slate-600 focus:border-pit-cyan focus:ring-4 focus:ring-pit-cyan/10"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="h-14 rounded-md bg-white px-6 py-4 text-sm font-semibold text-surface-950 transition hover:bg-pit-cyan focus:outline-none focus:ring-4 focus:ring-pit-cyan/20"
      >
        Join Waitlist
      </button>
      {error ? (
        <p className="text-sm font-medium text-pit-red sm:basis-full" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
