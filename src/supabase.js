// ─────────────────────────────────────────────────────────────────────────────
// FCRoster — Supabase integration
// File: src/supabase.js
//
// SETUP:
//   1. npm install @supabase/supabase-js
//   2. Replace SUPABASE_URL and SUPABASE_ANON_KEY below with your project values
//      (Dashboard → Project Settings → API)
//   3. Run the SQL in the comment block below in your Supabase SQL editor
//   4. Enable Google OAuth in Authentication → Providers → Google
//
// SQL TO RUN IN SUPABASE SQL EDITOR:
// ─────────────────────────────────────────────────────────────────────────────
// create table public.formations (
//   id          uuid primary key default gen_random_uuid(),
//   user_id     uuid references auth.users(id) on delete cascade not null,
//   title       text not null default 'My Formation',
//   game_fmt    text not null default '11v11',
//   formation   text not null default '4-3-3',
//   surface     text not null default 'grass',
//   palette_id  text not null default 'unit',
//   players     jsonb not null default '[]',
//   lines       jsonb not null default '[]',
//   subs        jsonb not null default '[]',
//   phases      jsonb not null default '[null,null,null,null,null]',
//   ball_pos    jsonb,
//   show_opp    boolean not null default false,
//   opp_fmt     text,
//   opp_list    jsonb not null default '[]',
//   opp_color   text,
//   created_at  timestamptz default now(),
//   updated_at  timestamptz default now()
// );
//
// -- Row Level Security: users can only see/edit their own formations
// alter table public.formations enable row level security;
//
// create policy "Users can read own formations"
//   on public.formations for select
//   using (auth.uid() = user_id);
//
// create policy "Users can insert own formations"
//   on public.formations for insert
//   with check (auth.uid() = user_id);
//
// create policy "Users can update own formations"
//   on public.formations for update
//   using (auth.uid() = user_id);
//
// create policy "Users can delete own formations"
//   on public.formations for delete
//   using (auth.uid() = user_id);
//
// -- Auto-update updated_at
// create or replace function update_updated_at()
// returns trigger as $$
// begin new.updated_at = now(); return new; end;
// $$ language plpgsql;
//
// create trigger set_updated_at
//   before update on public.formations
//   for each row execute function update_updated_at();
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from "@supabase/supabase-js";

// ── Replace these with your actual values ────────────────────────────────────
var SUPABASE_URL      = "https://myorudjfmsmixgjygsuk.supabase.co";
var SUPABASE_ANON_KEY = "sb_publishable_yRmySD6gXjrkykbv5bbeJQ_5Ho99mBE";
// ─────────────────────────────────────────────────────────────────────────────

export var supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession:   true,
    detectSessionInUrl: true,
  },
});

// ── Auth ─────────────────────────────────────────────────────────────────────

// Returns current session user or null
export async function getUser() {
  var { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}

// Sign in with Google (OAuth redirect)
export async function signInGoogle() {
  var redirectTo = window.location.hostname === "localhost"
    ? "http://localhost:5173/auth/callback"
    : "https://www.fcroster.com/auth/callback";
  var { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo },
  });
  if (error) throw error;
}

// Sign in with email + password
export async function signInEmail(email, password) {
  var { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

// Sign up with email + password + display name
export async function signUpEmail(email, password, name) {
  var { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } },
  });
  if (error) throw error;
  return data.user;
}

// Sign out
export async function signOut() {
  var { error } = await supabase.auth.signOut();
  if (error) throw error;
}

// Subscribe to auth state changes — call in useEffect
// onUser(user | null) fires immediately with current state, then on every change
export function onAuthChange(callback) {
  var { data } = supabase.auth.onAuthStateChange(function(event, session) {
    callback(session?.user ?? null);
  });
  return data.subscription.unsubscribe;
}

// ── Formations CRUD ──────────────────────────────────────────────────────────

// Load all formations for the current user (newest first)
export async function loadFormations() {
  var { data, error } = await supabase
    .from("formations")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data;
}

// Save current pitch state as a new formation
export async function saveFormation(state) {
  var { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Not signed in");

  var record = {
    user_id:    user.id,
    name:       state.title || "My Formation",
    state:      {},
    title:      state.title,
    game_fmt:   state.gameFmt,
    formation:  state.formation,
    surface:    state.surface,
    palette_id: state.paletteId,
    players:    state.players,
    lines:      state.lines,
    subs:       state.subs,
    phases:     state.phases,
    ball_pos:   state.ballPos,
    show_opp:   state.showOpp,
    opp_fmt:    state.oppFmt,
    opp_list:   state.oppList,
    opp_color:  state.oppColor,
    type:       state.type || "roster",
  };

  var { data, error } = await supabase
    .from("formations")
    .insert([record])
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Update an existing formation by id
export async function updateFormation(id, state) {
  var { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Not signed in");

  var record = {
    name:       state.title || "My Formation",
    state:      {},
    title:      state.title,
    game_fmt:   state.gameFmt,
    formation:  state.formation,
    surface:    state.surface,
    palette_id: state.paletteId,
    players:    state.players,
    lines:      state.lines,
    subs:       state.subs,
    phases:     state.phases,
    ball_pos:   state.ballPos,
    show_opp:   state.showOpp,
    opp_fmt:    state.oppFmt,
    opp_list:   state.oppList,
    opp_color:  state.oppColor,
    type:       state.type || "roster",
  };

  var { data, error } = await supabase
    .from("formations")
    .update(record)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// Delete a formation by id
export async function deleteFormation(id) {
  var user = await getUser();
  if (!user) throw new Error("Not signed in");

  var { error } = await supabase
    .from("formations")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw error;
}

// Load a single formation by id (for shared links)
export async function loadFormationById(id) {
  var { data, error } = await supabase
    .from("formations")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}