# Core Feature Implementation Checklist

## 1. API Integrations

- [ ] Set up Torn API key configuration (environment variable setup on local and Vercel).
- [ ] Create server-side API function for fetching faction data (`/faction/{ID}`).
  - [ ] Parse faction data (total money earned, faction rank, number of wars).
  - [ ] Return parsed data to frontend for display.
- [ ] Create server-side API function for fetching war data (`/faction/{ID}` with `selections=wars`).
  - [ ] Parse war data (opponents, outcomes, timestamps).
  - [ ] Return parsed war data for report generation and history display.

## 2. Dashboard Page

- [ ] Create the `/dashboard` page layout.
- [ ] Populate the dashboard with basic UI components (cards, tables) for faction data.
  - [ ] Display total money earned.
  - [ ] Display faction rank.
  - [ ] Display the number of wars participated in.
- [ ] Fetch and display faction data using the API integration.

## 3. War Report Generation

- [ ] Create `/war-report` page layout.
- [ ] Set up the form for war report filters (e.g., date range, opponents).
- [ ] Implement backend logic to fetch war data based on user-selected filters.
- [ ] Store generated war reports in Supabase for future access.
- [ ] Display the generated war report on the frontend.

## 4. War History Page

- [ ] Create `/war-history` page layout.
- [ ] Display a list of wars the faction has participated in.
- [ ] Fetch war history data using the API integration.
- [ ] Allow users to click on a war for more detailed information.

## 5. Admin Panel

- [ ] Create `/admin` page layout.
- [ ] Display a table with whitelisted factions and payment status.
- [ ] Implement functionality to add/remove factions from the whitelist (Supabase integration).
- [ ] Show payment history and status for whitelisted factions.
- [ ] Allow admins to view all invitations (without editing).

## 6. Invite System

- [ ] Create `/invites` page layout for faction owners.
- [ ] Implement form to generate invitation links/tokens for faction members.
- [ ] Store invitations in Supabase with tracking status (pending, accepted, expired).
- [ ] Display a list of invites sent by the faction owner.
- [ ] Ensure invited users can follow the link and join the system with the correct permissions.

## 7. Role-Based Permissions & Faction Leader Control

- [ ] Set up the Faction Roles table in Supabase:
  - [ ] Columns: role_name, faction_id, permissions_json.
- [ ] Set up the User Roles table in Supabase:
  - [ ] Columns: user_id, faction_id, role_id.
- [ ] Create a Role Management page for faction leaders:
  - [ ] UI to display roles and associated permissions (checkbox-based interface).
  - [ ] Allow faction leaders to update roles and permissions for their faction members.
- [ ] Implement Permission Checking Logic:
  - [ ] Middleware or utility functions to check user permissions based on their roles.
  - [ ] Integrate permission checks into the necessary parts of the system (e.g., war reports, admin panel access, etc.).

---

## General Tasks

- [ ] Set up Supabase tables for war reports, faction invites, whitelisted factions, and payments (if not already done).
- [ ] Implement role-based access control (admins vs faction owners vs members).
- [ ] Test all integrations locally.
- [ ] Deploy and test on Vercel.
