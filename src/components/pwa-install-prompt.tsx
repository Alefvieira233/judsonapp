"use client";

import { useEffect, useState } from "react";
import { ShareIcon, SmartphoneIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

// Chromium-only event; not in the standard TS lib.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "pwa-install-dismissed-at";
const DISMISS_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia?.("(display-mode: standalone)").matches) return true;
  // iOS pre-PWA-spec property.
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return nav.standalone === true;
}

function isIOS(): boolean {
  if (typeof window === "undefined") return false;
  const ua = window.navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);
}

function dismissedRecently(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (!raw) return false;
    const at = Number.parseInt(raw, 10);
    if (Number.isNaN(at)) return false;
    return Date.now() - at < DISMISS_TTL_MS;
  } catch {
    return false;
  }
}

export function PwaInstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;
    if (dismissedRecently()) return;

    if (isIOS()) {
      // iOS Safari does not fire beforeinstallprompt — show the manual hint
      // unconditionally on mount. This is post-mount initialization gated on
      // browser APIs (matchMedia, navigator.standalone) that aren't available
      // during SSR, so the effect is the right place despite the lint rule.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIosHint(true);
      setVisible(true);
      return;
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferred(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    const onInstalled = () => setVisible(false);
    window.addEventListener("appinstalled", onInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, Date.now().toString());
    } catch {
      // localStorage unavailable (private mode etc.) — accept lossy dismiss.
    }
  };

  const install = async () => {
    if (!deferred) return;
    try {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setVisible(false);
      } else {
        dismiss();
      }
    } catch (err) {
      console.warn("[pwa] install prompt failed", err);
      dismiss();
    } finally {
      setDeferred(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-label="Instalar o app"
      className="fixed inset-x-3 bottom-[calc(76px+env(safe-area-inset-bottom)+12px)] z-50 rounded-2xl border border-border bg-card/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-card/85"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dispensar"
        className="absolute right-2 top-2 grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
      >
        <XIcon className="size-4" aria-hidden />
      </button>

      <div className="flex items-start gap-3 pr-8">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--brand-primary)] text-white">
          <SmartphoneIcon className="size-5" aria-hidden />
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-display text-lg leading-tight">Instalar o app</p>
          {iosHint ? (
            <p className="text-xs text-muted-foreground">
              Abre o menu{" "}
              <ShareIcon className="inline size-3 align-[-2px]" aria-hidden /> e
              toca em <span className="text-foreground">Adicionar à Tela de Início</span>
              .
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Tenha o app fixado no celular pra abrir mais rápido e usar offline.
            </p>
          )}
        </div>
      </div>

      {!iosHint ? (
        <Button onClick={install} size="lg" className="mt-4 w-full">
          Instalar
        </Button>
      ) : null}
    </div>
  );
}
