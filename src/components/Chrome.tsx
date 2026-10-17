"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function Chrome({
  header,
  footer,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname() || "/";
  const bare =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/signup";

  if (bare) {
    return <main id="main">{children}</main>;
  }

  return (
    <>
      {header}
      <main id="main">{children}</main>
      {footer}
    </>
  );
}
