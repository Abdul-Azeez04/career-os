-- ═══════════════════════════════════════════════════════
-- Career OS: Storage Buckets
-- ═══════════════════════════════════════════════════════

-- Create storage buckets
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);
insert into storage.buckets (id, name, public) values ('media', 'media', true);
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', true);

-- Storage RLS: public read, admin write
create policy "storage_public_read" on storage.objects
  for select using (bucket_id in ('avatars', 'media', 'resumes'));

create policy "storage_admin_insert" on storage.objects
  for insert with check (
    bucket_id in ('avatars', 'media', 'resumes')
    and exists (select 1 from admin_users where id = auth.uid())
  );

create policy "storage_admin_update" on storage.objects
  for update using (
    bucket_id in ('avatars', 'media', 'resumes')
    and exists (select 1 from admin_users where id = auth.uid())
  );

create policy "storage_admin_delete" on storage.objects
  for delete using (
    bucket_id in ('avatars', 'media', 'resumes')
    and exists (select 1 from admin_users where id = auth.uid())
  );
