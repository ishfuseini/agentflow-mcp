/**
 * logo.dev Brand API client (task 6.3).
 *
 * GET {endpoint}/{domain} with Bearer LOGO_DEV_SECRET_KEY. The 200 response's
 * `logo` field is a ready-to-embed CDN URL (it embeds the publishable key).
 * 202 means the domain is still being indexed — retry once after a short wait.
 * Any failure returns null: the brand context is still useful without a logo.
 *
 * Docs: https://www.logo.dev/docs/brand/introduction
 */
const endpoint = (): string =>
  process.env.LOGO_DEV_BRAND_API_ENDPOINT ?? "https://api.logo.dev/brand";

export interface LogoDevBrand {
  name?: string;
  logo?: string;
}

/** Returns the company name and embeddable logo URL, or null on any failure. */
export async function fetchLogoDevBrand(domain: string): Promise<LogoDevBrand | null> {
  const key = process.env.LOGO_DEV_SECRET_KEY;
  if (!key) return null;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${endpoint()}/${encodeURIComponent(domain)}`, {
        headers: { Authorization: `Bearer ${key}` },
        signal: AbortSignal.timeout(20_000),
      });
      if (res.status === 202) {
        // Still indexing — one retry after a pause, then give up gracefully.
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 3_000));
          continue;
        }
        return null;
      }
      if (!res.ok) return null;
      return (await res.json()) as LogoDevBrand;
    } catch {
      return null;
    }
  }
  return null;
}
