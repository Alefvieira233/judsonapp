import { ImageResponse } from "next/og";
import { type NextRequest } from "next/server";
import { z } from "zod";

import { getCurrentProfile } from "@/lib/auth";
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
  logId: z.string().uuid(),
});

type WorkoutLogRow = {
  id: string;
  student_id: string | null;
  tenant_id: string | null;
  duration_minutes: number | null;
  rpe: number | null;
  workout: { title: string | null } | null;
  sets: { count: number }[];
};

export async function GET(request: NextRequest) {
  const session = await getCurrentProfile();
  if (!session) return unauthorizedResponse();

  const parsed = querySchema.safeParse({
    logId: request.nextUrl.searchParams.get("logId"),
  });
  if (!parsed.success) return notFoundResponse();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("workout_logs")
    .select(
      `id, student_id, tenant_id, duration_minutes, rpe,
       workout:workouts(title),
       sets:exercise_logs(count)`,
    )
    .eq("id", parsed.data.logId)
    .maybeSingle<WorkoutLogRow>();

  if (error || !data) return notFoundResponse();

  // Owner sees any tenant log; student only sees their own.
  const sameTenant = data.tenant_id === session.tenant.id;
  const isStudentOwner = data.student_id === session.profile.id;
  const isOwnerRole = session.profile.role === "owner";
  if (!sameTenant || !(isStudentOwner || isOwnerRole)) {
    return unauthorizedResponse();
  }

  const { tenant } = session;
  const colors = brandColors({
    primary: tenant.brand_color,
    primaryDark: tenant.brand_color_dark,
  });
  const fonts = await loadStoryFonts();

  const title = (data.workout?.title ?? "TREINO").toUpperCase();
  const sets = data.sets?.[0]?.count ?? 0;
  const duration = data.duration_minutes != null ? `${data.duration_minutes}min` : "—";
  const rpe = data.rpe != null ? data.rpe.toString() : "—";
  const handle = tenant.instagram_handle?.replace(/^@/, "") ?? null;

  const display = fonts.length > 0 ? "Bebas Neue, Inter, system-ui" : "system-ui";
  const body = fonts.length > 1 ? "Inter, system-ui" : "system-ui";

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
          backgroundImage: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 45%, #0A0A0A 100%)`,
          fontFamily: body,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
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
            Treino concluído
          </span>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <span
            style={{
              fontFamily: display,
              fontSize: 200,
              lineHeight: 0.92,
              letterSpacing: -2,
              textTransform: "uppercase",
              wordBreak: "break-word",
            }}
          >
            {title}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            gap: 40,
            paddingTop: 50,
            borderTop: "2px solid rgba(255,255,255,0.18)",
          }}
        >
          <Metric label="Duração" value={duration} family={display} />
          <Metric label="Séries" value={sets.toString()} family={display} />
          <Metric label="RPE" value={rpe} family={display} />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 60,
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

function Metric({
  label,
  value,
  family,
}: {
  label: string;
  value: string;
  family: string;
}) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
      <span style={{ fontSize: 26, letterSpacing: 8, textTransform: "uppercase", opacity: 0.7 }}>
        {label}
      </span>
      <span style={{ fontFamily: family, fontSize: 96, lineHeight: 1, letterSpacing: -1 }}>
        {value}
      </span>
    </div>
  );
}
