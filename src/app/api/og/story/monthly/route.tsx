import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
import { computeStreak } from "@/lib/dates";
import {
  MUSCLE_LABELS,
  MUSCLE_ORDER,
  computeStrengthScoreByMuscle,
} from "@/lib/strength-score";
import { createClient } from "@/lib/supabase/server";

import {
  STORY_CACHE_HEADER,
  STORY_HEIGHT,
  STORY_WIDTH,
  brandColors,
  loadStoryFonts,
  notFoundResponse,
  unauthorizedResponse,
} from "../../_lib";

export const runtime = "nodejs";
export const maxDuration = 10;

const querySchema = z.object({
  profileId: z.string().uuid(),
});

export async function GET(request: NextRequest) {
  const session = await getCurrentProfile();
  if (!session) return unauthorizedResponse();

  const parsed = querySchema.safeParse({
    profileId: request.nextUrl.searchParams.get("profileId"),
  });
  if (!parsed.success) return notFoundResponse();

  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, tenant_id, role")
    .eq("id", parsed.data.profileId)
    .maybeSingle();

  if (error || !profile) return notFoundResponse();

  const sameTenant = profile.tenant_id === session.tenant.id;
  const isSelf = profile.id === session.profile.id;
  const isOwnerRole = session.profile.role === "owner";
  if (!sameTenant || !(isSelf || isOwnerRole)) {
    return unauthorizedResponse();
  }

  // 30-day window for monthly card.
  const since = new Date(Date.now() - 30 * 86_400_000).toISOString();
  const [logsRes, strength] = await Promise.all([
    supabase
      .from("workout_logs")
      .select("completed_at")
      .eq("student_id", profile.id)
      .not("completed_at", "is", null)
      .gte("completed_at", since)
      .returns<{ completed_at: string }[]>(),
    computeStrengthScoreByMuscle({ userId: profile.id, supabase }),
  ]);

  const completed = (logsRes.data ?? [])
    .map((l) => l.completed_at)
    .filter((v): v is string => !!v);
  const totalMonth = completed.length;
  const streak = computeStreak(completed.map((s) => new Date(s)));

  const topMuscle = MUSCLE_ORDER.reduce((best, m) =>
    strength[m] > strength[best] ? m : best,
  );
  const topScore = strength[topMuscle];

  const { tenant } = session;
  const colors = brandColors({
    primary: tenant.brand_color,
    primaryDark: tenant.brand_color_dark,
  });
  const fonts = await loadStoryFonts();
  const handle = tenant.instagram_handle?.replace(/^@/, "") ?? null;
  const display = fonts.length > 0 ? "Bebas Neue, Inter, system-ui" : "system-ui";
  const body = fonts.length > 1 ? "Inter, system-ui" : "system-ui";
  const monthLabel = new Date()
    .toLocaleDateString("pt-BR", { month: "long" })
    .toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "120px 90px",
          color: "#FAFAFA",
          backgroundColor: "#0A0A0A",
          backgroundImage: `radial-gradient(circle at 80% 0%, ${colors.primary} 0%, transparent 55%), linear-gradient(180deg, #0A0A0A 0%, ${colors.primaryDark} 100%)`,
          fontFamily: body,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 4,
              backgroundColor: "#FAFAFA",
            }}
          />
          <span
            style={{
              fontSize: 32,
              letterSpacing: 12,
              textTransform: "uppercase",
              opacity: 0.85,
            }}
          >
            Resumo · {monthLabel}
          </span>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 40,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              style={{
                fontSize: 30,
                letterSpacing: 10,
                textTransform: "uppercase",
                opacity: 0.7,
              }}
            >
              Streak
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
              <span
                style={{
                  fontFamily: display,
                  fontSize: 360,
                  lineHeight: 0.85,
                  letterSpacing: -6,
                }}
              >
                {streak}
              </span>
              <span
                style={{
                  fontFamily: display,
                  fontSize: 90,
                  letterSpacing: 2,
                  opacity: 0.85,
                }}
              >
                {streak === 1 ? "DIA" : "DIAS"}
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 30,
            }}
          >
            <Card
              label="Treinos"
              value={totalMonth.toString()}
              family={display}
            />
            <Card
              label={MUSCLE_LABELS[topMuscle].toUpperCase()}
              value={topScore.toString()}
              family={display}
              accent={colors.primary}
            />
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 60,
            borderTop: "2px solid rgba(255,255,255,0.18)",
          }}
        >
          <span
            style={{
              fontFamily: display,
              fontSize: 56,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            {tenant.name}
          </span>
          {handle ? (
            <span style={{ fontSize: 32, opacity: 0.7 }}>@{handle}</span>
          ) : null}
        </div>
      </div>
    ),
    {
      width: STORY_WIDTH,
      height: STORY_HEIGHT,
      fonts: fonts.length > 0 ? fonts : undefined,
      headers: {
        "cache-control": STORY_CACHE_HEADER,
      },
    },
  );
}

function Card({
  label,
  value,
  family,
  accent,
}: {
  label: string;
  value: string;
  family: string;
  accent?: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "32px 30px",
        borderRadius: 28,
        border: "2px solid rgba(255,255,255,0.18)",
        backgroundColor: "rgba(0,0,0,0.35)",
      }}
    >
      <span
        style={{
          fontSize: 26,
          letterSpacing: 8,
          textTransform: "uppercase",
          opacity: 0.7,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: family,
          fontSize: 132,
          lineHeight: 1,
          letterSpacing: -1,
          color: accent ?? "#FAFAFA",
        }}
      >
        {value}
      </span>
    </div>
  );
}
