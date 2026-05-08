-- Quiet the advisor: stripe_events has RLS enabled but no policies. Service
-- role bypasses RLS anyway; this explicit deny tells anonymous/authenticated
-- clients they cannot read it.
drop policy if exists "stripe_events deny authenticated" on public.stripe_events;
create policy "stripe_events deny authenticated"
  on public.stripe_events
  for all
  to authenticated
  using (false)
  with check (false);

alter function public.touch_tenant_subscriptions_updated_at()
  set search_path = public, pg_temp;
