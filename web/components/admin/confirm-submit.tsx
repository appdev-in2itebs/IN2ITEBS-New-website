"use client";

import type { ReactNode } from "react";

/** A submit button that asks first, for actions that cannot be undone from the same screen. */
export function ConfirmSubmit({
  message,
  className,
  children,
  name,
  value,
  form,
}: {
  message: string;
  className?: string;
  children: ReactNode;
  /** Sent with the form, e.g. which bulk action was chosen. */
  name?: string;
  value?: string;
  /** The form this button submits, when it sits outside it. */
  form?: string;
}) {
  return (
    <button
      type="submit"
      name={name}
      value={value}
      form={form}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
