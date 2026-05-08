"use client";

import type { FormHTMLAttributes, ReactNode } from "react";

type LogoutFormProps = Omit<FormHTMLAttributes<HTMLFormElement>, "action"> & {
  action: () => Promise<void> | void;
  children: ReactNode;
};

/**
 * Logout form that nukes the service-worker cache before submitting.
 * Defense in depth for CRIT-2 (sw.js): even though the SW now refuses to cache
 * authenticated HTML, we still wipe everything on logout to clear any
 * static-asset cache the next user shouldn't see.
 */
export function LogoutForm({ action, children, ...rest }: LogoutFormProps) {
  return (
    <form
      {...rest}
      action={action}
      onSubmit={() => {
        if (typeof navigator !== "undefined" && navigator.serviceWorker?.controller) {
          try {
            navigator.serviceWorker.controller.postMessage({ type: "logout" });
          } catch {
            // Silent — the action still proceeds to signOut.
          }
        }
      }}
    >
      {children}
    </form>
  );
}
