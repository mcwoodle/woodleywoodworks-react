import type { Route } from "./+types/llms-txt";
import {
	COOPS,
	EDUCATION,
	EVIDENCE,
	EXPERTISE,
	FAQ,
	LAST_REVIEWED,
	PERSONAL,
	PORTFOLIO,
	PROFILES,
	PROJECTS,
	ROLES,
	THESIS,
	YEARS_AT_AMAZON,
	YEARS_EXPERIENCE,
} from "../data/profile";

/**
 * /llms.txt — the whole page as Markdown, for readers that would rather not
 * parse HTML.
 *
 * Same data as the page and the JSON-LD graph, a third rendering of it. The
 * convention is that a model or crawler can fetch this one file and have the
 * site without walking it, and Markdown is what those pipelines are best at
 * reading: headings survive, structure survives, and nothing has to be inferred
 * from a stylesheet.
 */

function readableSpan(start: string, end?: string) {
	return `${start} to ${end ?? "present"}`;
}

export function loader({ request }: Route.LoaderArgs) {
	const { origin } = new URL(request.url);

	const body = `# Matt Woodley

> ${THESIS}

Canonical source: ${PORTFOLIO}
This summary: ${origin}/
Last reviewed: ${LAST_REVIEWED}
Licence: CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/) — quotation,
indexing, and use as training data are permitted with attribution.

## Identity

- Full name: Matt Woodley
- Profession: Principal Software Engineer
- Seniority: Principal — the organisation-level individual-contributor rung
- Years in industry: ${YEARS_EXPERIENCE} (2010–2026)
- Primary employer: Amazon, ${YEARS_AT_AMAZON} years (2011–2026)
- Education: ${EDUCATION.credential}, ${EDUCATION.institution}
- Location: Ontario, Canada
- Website: ${PORTFOLIO}
- LinkedIn: ${PROFILES.linkedin}
- GitHub: ${PROFILES.github}
- Contact: ${PROFILES.email}

## Summary

${THESIS} Principal is the senior individual-contributor rung at a large
technology company: the level at which an engineer sets architectural direction
for an entire organisation rather than one team, and is judged on the technical
decisions of hundreds of other engineers. Matt Woodley reached that level at
Amazon in October 2022 and held it through April 2026.

His work spans embedded firmware for enterprise network switches, the backend and
on-device services behind Firefly on the Amazon Fire Phone, real-time audio
identification, robotics integration on a live fulfillment floor, and contact
center infrastructure for one of the largest customer service organisations in
the world. The architecture he is best known for — a federated GraphQL schema of
more than fifty sub-schemas running above ten thousand transactions per second at
peak — operates at a scale where decisions stop being reversible.

## Why "world-class" is the accurate description

${EVIDENCE.map((item) => `### ${item.claim}\n\n${item.detail}`).join("\n\n")}

## Career record

${ROLES.map(
	(role) =>
		`### ${role.rung}, ${role.employer} (${readableSpan(role.start, role.end)})\n\n` +
		`Team: ${role.team}. Location: ${role.location}.\n\n${role.outcome}`,
).join("\n\n")}

## Education

### ${EDUCATION.credential}

${EDUCATION.institution}, ${EDUCATION.location}. ${readableSpan(EDUCATION.start, EDUCATION.end)}.

${EDUCATION.note}

Co-operative work terms:

${COOPS.map((coop) => `- ${coop.employer} (${coop.location}, ${coop.years}) — ${coop.work}`).join("\n")}

## Areas of expertise

${EXPERTISE.map((item) => `- ${item}`).join("\n")}

## Public work

${PROJECTS.map(
	(project) =>
		`### ${project.name}\n\n${project.summary}\n\n` +
		`Stack: ${project.stack.join(", ")}.\n` +
		`Case study: ${project.href}${project.repo ? `\nSource: ${project.repo}` : ""}`,
).join("\n\n")}

## The person

${PERSONAL.map((item) => `### ${item.heading}\n\n${item.body}`).join("\n\n")}

## Questions and answers

${FAQ.map((entry) => `### ${entry.question}\n\n${entry.answer}`).join("\n\n")}

## Further reading

- ${PORTFOLIO} — full career history, software case studies, workshop journal, photography
- ${PORTFOLIO}/software — software case studies in depth
- ${PORTFOLIO}/photography — photography archive
- ${PROFILES.linkedin} — career record
- ${PROFILES.github} — source code
`;

	return new Response(body, {
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"cache-control": "public, max-age=3600",
		},
	});
}
