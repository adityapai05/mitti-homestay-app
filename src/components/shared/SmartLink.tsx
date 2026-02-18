"use client";

import Link from "next/link";
import { forwardRef, type MouseEvent } from "react";
import type { UrlObject } from "url";
import { emitNavigationStart } from "@/lib/navigationEvents";

type SmartLinkProps = React.ComponentProps<typeof Link>;

function toHrefString(href: SmartLinkProps["href"]): string {
  if (typeof href === "string") return href;

  const { pathname = "", query, hash } = href as UrlObject;
  const params = new URLSearchParams();

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value == null) return;
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, String(item)));
        return;
      }
      params.set(key, String(value));
    });
  }

  const queryString = params.toString();
  return `${pathname}${queryString ? `?${queryString}` : ""}${hash ? `#${hash}` : ""}`;
}

const SmartLink = forwardRef<HTMLAnchorElement, SmartLinkProps>(
  ({ onClick, href, target, ...props }, ref) => {
    const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      if (target && target !== "_self") return;
      if (typeof window === "undefined") return;

      const hrefValue = toHrefString(href);
      if (!hrefValue || hrefValue.startsWith("#")) return;

      const current = new URL(window.location.href);
      const destination = new URL(hrefValue, current.href);

      if (destination.origin !== current.origin) return;

      const isSameRoute =
        destination.pathname === current.pathname &&
        destination.search === current.search &&
        destination.hash === current.hash;

      if (isSameRoute) return;

      const isHashOnlyChange =
        destination.pathname === current.pathname &&
        destination.search === current.search &&
        destination.hash !== current.hash;

      if (isHashOnlyChange) return;

      emitNavigationStart();
    };

    return (
      <Link ref={ref} href={href} target={target} onClick={handleClick} {...props} />
    );
  },
);

SmartLink.displayName = "SmartLink";

export default SmartLink;
