/**
 * Specialist route group layout (KAN-25).
 *
 * Thin server component that wraps the whole (specialist) subtree in a
 * data-theme="specialist" container so the persona's semantic tokens resolve.
 * Navigating within the group keeps the theme; crossing into (patient)
 * swaps it via that group's own layout.
 */
export default function SpecialistLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div data-theme="specialist" className="flex flex-1 flex-col">
      {children}
    </div>
  );
}
