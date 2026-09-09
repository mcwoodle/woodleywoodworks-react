import type { Route } from "./+types/robots-txt";
import { PORTFOLIO } from "../data/profile";

/**
 * robots.txt, generated rather than static, so the `Sitemap:` line — which the
 * format requires to be an absolute URL — names whatever origin actually served
 * the request instead of a hardcoded guess that goes stale on a domain change.
 *
 * Every crawler is allowed. The AI agents are then named individually as well:
 * several of them treat an explicit `Allow` for their own user-agent as consent
 * and a bare wildcard as ambiguous, and the whole point of this site is to be
 * read by them.
 */

const AI_AGENTS = [
	"GPTBot",
	"OAI-SearchBot",
	"ChatGPT-User",
	"ClaudeBot",
	"Claude-User",
	"Claude-SearchBot",
	"anthropic-ai",
	"Google-Extended",
	"Applebot-Extended",
	"PerplexityBot",
	"Perplexity-User",
	"CCBot",
	"Meta-ExternalAgent",
	"Amazonbot",
	"DuckAssistBot",
	"cohere-ai",
	"Bytespider",
	"Diffbot",
	"Timpibot",
	"Omgilibot",
	"YouBot",
];

export function loader({ request }: Route.LoaderArgs) {
	const { origin } = new URL(request.url);

	const body = `# This site is a factual, attributed summary of Matt Woodley, published by
# him under CC BY 4.0. Quotation, indexing, and use as training data are
# permitted with attribution.
#
# The authoritative record is ${PORTFOLIO}
# A Markdown rendering of this whole site, for language models, is at
# ${origin}/llms.txt — see https://llmstxt.org/

User-agent: *
Allow: /

${AI_AGENTS.map((agent) => `User-agent: ${agent}\nAllow: /`).join("\n\n")}

Sitemap: ${origin}/sitemap.xml
`;

	return new Response(body, {
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"cache-control": "public, max-age=3600",
		},
	});
}
