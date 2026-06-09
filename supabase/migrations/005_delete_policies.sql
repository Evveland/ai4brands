-- Allow anon key to delete (used by admin panel server actions)
create policy "Anon delete users"           on public.users              for delete using (true);
create policy "Anon delete startups"        on public.startups           for delete using (true);
create policy "Anon delete org_members"     on public.org_members        for delete using (true);
create policy "Anon delete meetings"        on public.meetings           for delete using (true);
create policy "Anon delete votes"           on public.votes              for delete using (true);
create policy "Anon delete recommendations" on public.recommendations    for delete using (true);
create policy "Anon delete invitations"     on public.invitations        for delete using (true);
create policy "Anon delete responses"       on public.challenge_responses for delete using (true);
