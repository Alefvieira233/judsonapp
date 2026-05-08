"use client";

import { useEffect, useState } from "react";
import { BellIcon, BellOffIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type Status =
  | "loading"
  | "unsupported"
  | "denied"
  | "subscribed"
  | "available"
  | "no-key";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const buffer = new ArrayBuffer(raw.length);
  const out = new Uint8Array(buffer);
  for (let i = 0; i < raw.length; i += 1) out[i] = raw.charCodeAt(i);
  return out;
}

export function PushOptIn() {
  const [status, setStatus] = useState<Status>("loading");
  const [busy, setBusy] = useState(false);
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  useEffect(() => {
    let cancelled = false;
    async function init() {
      if (typeof window === "undefined") return;
      if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
        if (!cancelled) setStatus("unsupported");
        return;
      }
      if (!publicKey) {
        if (!cancelled) setStatus("no-key");
        return;
      }
      try {
        const reg = await navigator.serviceWorker.ready;
        const existing = await reg.pushManager.getSubscription();
        if (cancelled) return;
        if (existing) {
          setEndpoint(existing.endpoint);
          setStatus("subscribed");
          return;
        }
        if (Notification.permission === "denied") {
          setStatus("denied");
          return;
        }
        setStatus("available");
      } catch (err) {
        console.warn("[push-opt-in] init failed", err);
        if (!cancelled) setStatus("unsupported");
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, [publicKey]);

  async function subscribe() {
    if (!publicKey) return;
    setBusy(true);
    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "denied" : "available");
        return;
      }
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });
      const json = sub.toJSON();
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          subscription: {
            endpoint: json.endpoint,
            keys: {
              p256dh: json.keys?.p256dh ?? "",
              auth: json.keys?.auth ?? "",
            },
          },
        }),
      });
      if (!res.ok) {
        await sub.unsubscribe().catch(() => {});
        setStatus("available");
        return;
      }
      setEndpoint(sub.endpoint);
      setStatus("subscribed");
    } catch (err) {
      console.warn("[push-opt-in] subscribe failed", err);
      setStatus("available");
    } finally {
      setBusy(false);
    }
  }

  async function unsubscribe() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        }).catch(() => {});
        await sub.unsubscribe().catch(() => {});
      }
      setEndpoint(null);
      setStatus("available");
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") return null;

  if (status === "unsupported" || status === "no-key") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/20 p-4 text-sm">
        <span className="flex items-center gap-3 text-muted-foreground">
          <BellOffIcon className="size-4" aria-hidden />
          Lembretes não suportados nesse navegador
        </span>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/20 p-4 text-sm">
        <span className="flex items-center gap-3 text-muted-foreground">
          <BellOffIcon className="size-4" aria-hidden />
          Notificações bloqueadas — ative nas configurações do navegador
        </span>
      </div>
    );
  }

  if (status === "subscribed") {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/20 p-4 text-sm">
        <span className="flex items-center gap-3 text-foreground">
          <BellIcon className="size-4 text-[var(--brand-primary)]" aria-hidden />
          Lembretes ativos
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={unsubscribe}
          disabled={busy}
          aria-label="Desativar lembretes"
          data-endpoint={endpoint ?? undefined}
        >
          Desativar
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card/20 p-4 text-sm">
      <span className="flex items-center gap-3 text-foreground">
        <BellIcon className="size-4 text-muted-foreground" aria-hidden />
        Receber lembretes de treino
      </span>
      <Button type="button" size="sm" onClick={subscribe} disabled={busy}>
        Ativar
      </Button>
    </div>
  );
}
