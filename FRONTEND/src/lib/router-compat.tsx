/**
 * Thin compatibility layer so the ported HomeFit pages can keep using the
 * simple `navigate("/path")` / `<Link to="/path">` / `useLocation()` API
 * while the app actually runs on TanStack Router.
 */
import {
  Link as TanstackLink,
  useNavigate as useTanstackNavigate,
  useRouterState,
} from "@tanstack/react-router";
import type { AnchorHTMLAttributes, ReactNode } from "react";

export function useNavigate() {
  const navigate = useTanstackNavigate();
  return (to: string, opts?: { replace?: boolean }) =>
    navigate({ to: to as never, replace: opts?.replace ?? false });
}

export function useLocation() {
  return useRouterState({ select: (s) => s.location });
}

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  children?: ReactNode;
};

export function Link({ to, children, ...rest }: LinkProps) {
  return (
    <TanstackLink to={to as never} {...(rest as Record<string, unknown>)}>
      {children}
    </TanstackLink>
  );
}
