"use client";

import { useState } from "react";
import Link from "next/link";

const field =
  "mt-1.5 block w-full rounded-control border border-border-subtle bg-surface px-3.5 py-2.5 text-sm text-foreground focus:border-action focus:outline-none";
const labelCls = "block text-sm font-medium text-foreground";

/** The careers application: details plus a CV (PDF or Word, up to 5 MB), posted to /api/apply. */
export function ApplyForm({ openingId, title }: { openingId: string; title: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const cv = form.get("cv");
    if (cv instanceof File && cv.size > 5 * 1024 * 1024)
      return setError(
        `Your CV is ${(cv.size / 1024 / 1024).toFixed(1)} MB. The CV must be under 5 MB: please upload a smaller PDF or Word file.`,
      );
    if (cv instanceof File && cv.size > 0 && !/\.(pdf|docx?)$/i.test(cv.name))
      return setError("Please upload your CV as a PDF, DOC or DOCX file under 5 MB.");
    setState("sending");
    try {
      const res = await fetch("/api/apply/", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setState("idle");
        return;
      }
      setState("done");
    } catch {
      setError("We could not reach the server. Please check your connection and try again.");
      setState("idle");
    }
  }

  if (state === "done")
    return (
      <div role="status" className="rounded-feature border border-border-subtle bg-surface p-8">
        <h3 className="text-h3 font-semibold text-foreground">Thank you for applying.</h3>
        <p className="mt-3 text-foreground-muted">
          Your application for {title} has reached our HR team. We will contact you if your profile matches the role.
        </p>
        <Link href="/careers/current-openings/" className="mt-6 inline-block font-semibold text-action">
          See other openings
        </Link>
      </div>
    );

  return (
    <form
      onSubmit={onSubmit}
      data-apply-form
      className="space-y-5 rounded-feature border border-border-subtle bg-surface p-6 md:p-8"
    >
      <input type="hidden" name="openingId" value={openingId} />
      {/* Honeypot: hidden from people, filled in by bots. */}
      <div className="hidden" aria-hidden>
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className={labelCls}>
          Full name *
          <input name="name" required minLength={2} maxLength={120} autoComplete="name" className={field} />
        </label>
        <label className={labelCls}>
          Email *
          <input name="email" type="email" required maxLength={254} autoComplete="email" className={field} />
        </label>
        <label className={labelCls}>
          Phone *
          <input name="phone" type="tel" required minLength={6} maxLength={40} autoComplete="tel" className={field} />
        </label>
        <label className={labelCls}>
          Current location
          <input name="location" maxLength={120} autoComplete="address-level2" className={field} />
        </label>
        <label className={labelCls}>
          Current role and company
          <input name="currentRole" maxLength={160} className={field} />
        </label>
        <label className={labelCls}>
          Notice period
          <input name="noticePeriod" maxLength={60} placeholder="e.g. 30 days" className={field} />
        </label>
        <label className={labelCls}>
          Expected CTC
          <input name="expectedCtc" maxLength={60} className={field} />
        </label>
        <label className={labelCls}>
          LinkedIn profile
          <input
            name="linkedinUrl"
            type="url"
            maxLength={300}
            placeholder="https://www.linkedin.com/in/…"
            className={field}
          />
        </label>
      </div>
      <label className={labelCls}>
        Cover note
        <textarea name="coverNote" rows={4} maxLength={3000} className={field} />
      </label>
      <label className={labelCls}>
        CV (PDF or Word, up to 5 MB) *
        <input
          name="cv"
          type="file"
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="mt-1.5 block w-full text-sm text-foreground-muted file:mr-4 file:rounded-full file:border-0 file:bg-action file:px-4 file:py-2 file:text-sm file:font-semibold file:text-on-action"
        />
      </label>
      <label className="flex items-start gap-3 text-sm text-foreground-muted">
        <input name="consent" type="checkbox" value="yes" required className="mt-1 h-4 w-4" />
        <span>
          I agree that In2IT EBS may store my details and CV to consider me for this and similar roles, as described in
          the{" "}
          <Link href="/legal/privacy-notice/" className="underline">
            privacy notice
          </Link>
          . *
        </span>
      </label>
      {error ? (
        <p role="alert" className="text-sm font-medium text-foreground">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={state === "sending"}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-action px-6 py-3 text-sm font-semibold text-on-action shadow-glass transition-colors hover:bg-action-hover disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Submit application"}
      </button>
    </form>
  );
}
