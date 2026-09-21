import Image from "next/image";
import { BRAND_LOGO_SOURCE } from "@/lib/brand";

const AUTH_BRAND_LOGO_SOURCE = "/assets/brand/himi-sidebar-logo-transparent.webp";

export function BrandLogoImage({ priority = false, size = 54 }: { priority?: boolean; size?: number }) {
  return <Image alt="" aria-hidden="true" draggable={false} height={size} priority={priority} sizes={`${size}px`} src={BRAND_LOGO_SOURCE} unoptimized width={size} />;
}

export function BrandMark({ priority = false }: { priority?: boolean }) {
  return <span aria-hidden="true" className="brand-mark"><BrandLogoImage priority={priority} size={60} /></span>;
}

export function AuthBrandMark({ priority = false }: { priority?: boolean }) {
  return <span aria-hidden="true" className="brand-mark auth-brand-mark">
    <Image alt="" draggable={false} height={60} priority={priority} sizes="60px" src={AUTH_BRAND_LOGO_SOURCE} unoptimized width={60} />
  </span>;
}

export function BrandWordmark() {
  return <span className="brand-wordmark"><strong>Himi</strong><span>Chinese</span></span>;
}
