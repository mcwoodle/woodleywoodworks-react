import { type RouteConfig, index, route } from "@react-router/dev/routes";

// The three machine-facing files are routes rather than static assets in
// public/, so each is generated from the same profile data as the page and
// resolves its own origin from the request. Nothing here can fall out of step
// with the page, and nothing hardcodes a domain.
export default [
	index("routes/home.tsx"),
	route("llms.txt", "routes/llms-txt.ts"),
	route("robots.txt", "routes/robots-txt.ts"),
	route("sitemap.xml", "routes/sitemap.ts"),
] satisfies RouteConfig;
