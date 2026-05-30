/**
 * Patient route group layout (KAN-25).
 *
 * Thin server component that wraps the whole (patient) subtree in a
 * data-theme="patient" container so the persona's semantic tokens resolve.
 * Navigating within the group keeps the theme; crossing into (specialist)
 * swaps it via that group's own layout.
 */
export default function PatientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div data-theme="patient" className="flex flex-1 flex-col">
      {children}
    </div>
  );
}
