-- ─────────────────────────────────────────────────────────────────────────────
-- 0017_chat.sql
--
-- 1:1 in-app chat between a student and the tenant owner. One thread per
-- (tenant_id, student_id). Messages stream live via Supabase Realtime —
-- the Realtime publication is added at the bottom.
--
-- RLS:
--   • chat_threads:
--       SELECT — student sees own thread; owner sees all threads in tenant.
--       INSERT — owner can pre-create; student can create their own row.
--   • chat_messages:
--       SELECT — caller must belong to the parent thread (student or owner).
--       INSERT — sender_id = auth.uid() AND caller belongs to the thread.
--       UPDATE — only read_at can be flipped, by the caller (i.e. the recipient).
--       DELETE — only the original sender.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.chat_threads (
  id              uuid primary key default gen_random_uuid(),
  tenant_id       uuid not null references public.tenants(id) on delete cascade,
  student_id      uuid not null references public.profiles(id) on delete cascade,
  created_at      timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  unique (tenant_id, student_id)
);

create index if not exists chat_threads_tenant_idx
  on public.chat_threads (tenant_id, last_message_at desc);
create index if not exists chat_threads_student_idx
  on public.chat_threads (student_id);

create table if not exists public.chat_messages (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references public.chat_threads(id) on delete cascade,
  sender_id   uuid not null references auth.users(id) on delete cascade,
  content     text not null check (char_length(content) between 1 and 2000),
  created_at  timestamptz not null default now(),
  read_at     timestamptz
);

create index if not exists chat_messages_thread_created_idx
  on public.chat_messages (thread_id, created_at desc);
create index if not exists chat_messages_unread_idx
  on public.chat_messages (thread_id, sender_id) where read_at is null;

alter table public.chat_threads enable row level security;
alter table public.chat_messages enable row level security;

-- ── chat_threads ────────────────────────────────────────────────────────────
drop policy if exists chat_threads_member_read on public.chat_threads;
create policy chat_threads_member_read
  on public.chat_threads for select to authenticated
  using (
    tenant_id = public.auth_tenant_id()
    and (
      student_id = auth.uid()
      or public.auth_role() = 'owner'
    )
  );

drop policy if exists chat_threads_member_insert on public.chat_threads;
create policy chat_threads_member_insert
  on public.chat_threads for insert to authenticated
  with check (
    tenant_id = public.auth_tenant_id()
    and (
      student_id = auth.uid()
      or public.auth_role() = 'owner'
    )
  );

-- ── chat_messages ───────────────────────────────────────────────────────────
drop policy if exists chat_messages_thread_read on public.chat_messages;
create policy chat_messages_thread_read
  on public.chat_messages for select to authenticated
  using (
    exists (
      select 1
      from public.chat_threads t
      where t.id = chat_messages.thread_id
        and t.tenant_id = public.auth_tenant_id()
        and (
          t.student_id = auth.uid()
          or public.auth_role() = 'owner'
        )
    )
  );

drop policy if exists chat_messages_thread_insert on public.chat_messages;
create policy chat_messages_thread_insert
  on public.chat_messages for insert to authenticated
  with check (
    sender_id = auth.uid()
    and exists (
      select 1
      from public.chat_threads t
      where t.id = chat_messages.thread_id
        and t.tenant_id = public.auth_tenant_id()
        and (
          t.student_id = auth.uid()
          or public.auth_role() = 'owner'
        )
    )
  );

-- UPDATE is meant for read receipts only. We can't enforce "only read_at
-- changed" in a USING/WITH CHECK clause without a trigger, so we restrict
-- UPDATE to the recipient (a non-sender member of the thread). The server
-- action also pins the SET to read_at = now().
drop policy if exists chat_messages_recipient_update on public.chat_messages;
create policy chat_messages_recipient_update
  on public.chat_messages for update to authenticated
  using (
    sender_id <> auth.uid()
    and exists (
      select 1
      from public.chat_threads t
      where t.id = chat_messages.thread_id
        and t.tenant_id = public.auth_tenant_id()
        and (
          t.student_id = auth.uid()
          or public.auth_role() = 'owner'
        )
    )
  )
  with check (
    sender_id <> auth.uid()
    and exists (
      select 1
      from public.chat_threads t
      where t.id = chat_messages.thread_id
        and t.tenant_id = public.auth_tenant_id()
        and (
          t.student_id = auth.uid()
          or public.auth_role() = 'owner'
        )
    )
  );

drop policy if exists chat_messages_sender_delete on public.chat_messages;
create policy chat_messages_sender_delete
  on public.chat_messages for delete to authenticated
  using (sender_id = auth.uid());

-- ── Realtime publication ────────────────────────────────────────────────────
-- Idempotent: skip if the table is already in the publication.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'chat_messages'
  ) then
    execute 'alter publication supabase_realtime add table public.chat_messages';
  end if;
end $$;

comment on table public.chat_threads is
  '1:1 chat thread between a student and the tenant owner. Created on first message.';
comment on table public.chat_messages is
  'Chat messages streamed via Supabase Realtime. read_at marks recipient delivery.';
