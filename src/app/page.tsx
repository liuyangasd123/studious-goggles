// This file is effectively replaced by src/app/(main)/page.tsx
// due to route groups. If you need a separate root page outside the (main) layout,
// you can implement it here. Otherwise, (main)/page.tsx serves as the default.
// For this app, we want the root to be the dashboard within the main layout.
// The Next.js router will automatically pick up src/app/(main)/page.tsx for the '/' path.
export default function Home() {
  // Content for a standalone root page if (main)/page.tsx didn't exist or wasn't for '/'
  // In this setup, this component might not be rendered directly if (main)/page.tsx handles '/'.
  // It's good practice to keep it minimal or redirect if a specific layout is always expected for '/'.
  return null; 
}
