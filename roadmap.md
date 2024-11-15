# Roadmap for Torn War Calculator Prototype Development

## Phase 1: Foundation Setup (DONE)

1. **Development Environment Set Up**
   * Next.js 13 with TypeScript and App Router.
   * Installed necessary dependencies: `next-auth`, `@next-auth/supabase-adapter`, `@supabase/supabase-js`.
2. **Supabase Configuration**
   * **Database Schema**: Created tables (`user_profiles`, `factions`, `memberships`).
   * **Authentication Integration**: Configured NextAuth.js with Supabase, including custom `authorize` function and session handling.
   * **Row-Level Security (RLS)**: Implemented RLS policies to secure data access.
3. **Environment Variables and Security**
   * Set up `.env.local` with Supabase credentials and NextAuth secret.
   * Ensured sensitive information is not committed to version control.
4. **Testing and Validation**
   * Verified user creation and authentication flows.
   * Confirmed that RLS policies are enforced correctly.
   * Tested data fetching and role-based access control.

## Phase 2: Frontend Development

1. **Build the Authentication Pages**
   * **Sign-In Page**: Create a user-friendly sign-in page where users can log in with their Torn API keys.
   * **Protected Routes**: Implement route protection to ensure only authenticated users can access certain pages.
2. **Develop the Dashboard Interface**
   * **User Dashboard**: Design a dashboard that displays relevant user information and statistics.
   * **Faction Data**: Show faction details, member lists, and war statuses.
3. **Implement Client-Side Data Fetching**
   * **Use Supabase Client**: Fetch data from your Supabase database using the client-side Supabase client.
   * **Handle RLS Policies**: Ensure that RLS policies are respected in your data fetching logic.
4. **Create Responsive UI Components**
   * **Use a UI Framework**: Consider using a component library like Tailwind CSS, Material UI, or Chakra UI for rapid development.
   * **Mobile-Friendly Design**: Ensure the application is responsive and works well on different screen sizes.
