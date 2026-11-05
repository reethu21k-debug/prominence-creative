// A template remounts on every navigation, so this CSS fade runs per page.
// Opacity only (no transform) so it never creates a containing block for fixed elements,
// and it works without JavaScript. Reduced-motion is handled in globals.css.
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
