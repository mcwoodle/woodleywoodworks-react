import type { Route } from "./+types/sitemap";
import { LAST_REVIEWED } from "../data/profile";

/** Two URLs is still a sitemap, and a robots.txt that promises one should have one. */
const PATHS = ["/", "/llms.txt"];

export function loader({ request }: Route.LoaderArgs) {
	const { origin } = new URL(request.url);

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${PATHS.map(
	(path) =>
		`  <url>\n    <loc>${origin}${path}</loc>\n    <lastmod>${LAST_REVIEWED}</lastmod>\n  </url>`,
).join("\n")}
</urlset>
`;

	return new Response(body, {
		headers: {
			"content-type": "application/xml; charset=utf-8",
			"cache-control": "public, max-age=3600",
		},
	});
}
