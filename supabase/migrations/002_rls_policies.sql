-- ═══════════════════════════════════════════════════════
-- Career OS: Row-Level Security Policies
-- Pattern: public SELECT where is_published = true
--          admin INSERT/UPDATE/DELETE via admin_users check
-- ═══════════════════════════════════════════════════════

-- Helper function to check if current user is an admin
create or replace function is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from admin_users where id = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- ───────────────────────────────────────────────────────
-- site_config: public read (unconditional), admin write
-- ───────────────────────────────────────────────────────
alter table site_config enable row level security;

create policy "site_config_public_read" on site_config
  for select using (true);

create policy "site_config_admin_update" on site_config
  for update using (is_admin());

create policy "site_config_admin_insert" on site_config
  for insert with check (is_admin());

create policy "site_config_admin_delete" on site_config
  for delete using (is_admin());

-- ───────────────────────────────────────────────────────
-- experience: published read, admin write
-- ───────────────────────────────────────────────────────
alter table experience enable row level security;

create policy "experience_public_read" on experience
  for select using (is_published = true or is_admin());

create policy "experience_admin_insert" on experience
  for insert with check (is_admin());

create policy "experience_admin_update" on experience
  for update using (is_admin());

create policy "experience_admin_delete" on experience
  for delete using (is_admin());

-- ───────────────────────────────────────────────────────
-- certifications: published read, admin write
-- ───────────────────────────────────────────────────────
alter table certifications enable row level security;

create policy "certifications_public_read" on certifications
  for select using (is_published = true or is_admin());

create policy "certifications_admin_insert" on certifications
  for insert with check (is_admin());

create policy "certifications_admin_update" on certifications
  for update using (is_admin());

create policy "certifications_admin_delete" on certifications
  for delete using (is_admin());

-- ───────────────────────────────────────────────────────
-- skills: public read (unconditional), admin write
-- ───────────────────────────────────────────────────────
alter table skills enable row level security;

create policy "skills_public_read" on skills
  for select using (true);

create policy "skills_admin_insert" on skills
  for insert with check (is_admin());

create policy "skills_admin_update" on skills
  for update using (is_admin());

create policy "skills_admin_delete" on skills
  for delete using (is_admin());

-- ───────────────────────────────────────────────────────
-- projects: published read, admin write
-- ───────────────────────────────────────────────────────
alter table projects enable row level security;

create policy "projects_public_read" on projects
  for select using (is_published = true or is_admin());

create policy "projects_admin_insert" on projects
  for insert with check (is_admin());

create policy "projects_admin_update" on projects
  for update using (is_admin());

create policy "projects_admin_delete" on projects
  for delete using (is_admin());

-- ───────────────────────────────────────────────────────
-- writing: published read, admin write
-- ───────────────────────────────────────────────────────
alter table writing enable row level security;

create policy "writing_public_read" on writing
  for select using (is_published = true or is_admin());

create policy "writing_admin_insert" on writing
  for insert with check (is_admin());

create policy "writing_admin_update" on writing
  for update using (is_admin());

create policy "writing_admin_delete" on writing
  for delete using (is_admin());

-- ───────────────────────────────────────────────────────
-- testimonials: published read, admin write
-- ───────────────────────────────────────────────────────
alter table testimonials enable row level security;

create policy "testimonials_public_read" on testimonials
  for select using (is_published = true or is_admin());

create policy "testimonials_admin_insert" on testimonials
  for insert with check (is_admin());

create policy "testimonials_admin_update" on testimonials
  for update using (is_admin());

create policy "testimonials_admin_delete" on testimonials
  for delete using (is_admin());

-- ───────────────────────────────────────────────────────
-- contact_messages: public INSERT, admin read/update/delete
-- ───────────────────────────────────────────────────────
alter table contact_messages enable row level security;

create policy "contact_messages_public_insert" on contact_messages
  for insert with check (true);

create policy "contact_messages_admin_read" on contact_messages
  for select using (is_admin());

create policy "contact_messages_admin_update" on contact_messages
  for update using (is_admin());

create policy "contact_messages_admin_delete" on contact_messages
  for delete using (is_admin());

-- ───────────────────────────────────────────────────────
-- admin_users: admin-only access
-- ───────────────────────────────────────────────────────
alter table admin_users enable row level security;

create policy "admin_users_self_read" on admin_users
  for select using (id = auth.uid());

create policy "admin_users_owner_manage" on admin_users
  for all using (
    exists (select 1 from admin_users where id = auth.uid() and role = 'owner')
  );
