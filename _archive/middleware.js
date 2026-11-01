// IA fácil is intentionally public after purchase.
// The payment is handled by Stripe; the course content itself has no login wall.
// Keep this middleware as a no-op so old deployments/configurations cannot block the course.
export default function middleware() { return; }

export const config = {
  matcher: ["/ia-facil/curso/:path*"]
};
