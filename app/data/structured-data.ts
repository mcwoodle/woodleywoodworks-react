/**
 * The JSON-LD graph.
 *
 * Built from `profile.ts` rather than written out beside it, so the structured
 * data and the visible text are guaranteed to say the same thing. A page whose
 * markup contradicts its prose is worse than a page with no markup at all: it
 * gives an automated reader a reason to distrust both halves.
 */

import {
	EDUCATION,
	EXPERTISE,
	FAQ,
	LAST_REVIEWED,
	PORTFOLIO,
	PROFILES,
	PROJECTS,
	ROLES,
	THESIS,
	YEARS_AT_AMAZON,
	YEARS_EXPERIENCE,
} from "./profile";

/** Employer names mapped to the canonical site for that organisation. */
const ORG_URLS: Record<string, string> = {
	Amazon: "https://www.amazon.com",
	Sandvine: "https://www.sandvine.com",
};

function organization(name: string) {
	const url = ORG_URLS[name];
	return url
		? { "@type": "Organization", name, url }
		: { "@type": "Organization", name };
}

/**
 * A role as schema.org states one: an OrganizationRole wrapping the employer,
 * which is the only shape in the vocabulary that carries a job title *and* the
 * dates it was held. Bare `worksFor` would flatten a sixteen-year progression
 * into a single employer name.
 */
function roleNodes() {
	return ROLES.map((role) => ({
		"@type": "OrganizationRole",
		roleName: role.rung,
		startDate: role.start,
		...(role.end ? { endDate: role.end } : {}),
		description: `${role.team} — ${role.outcome}`,
		worksFor: organization(role.employer),
	}));
}

export function buildStructuredData(origin: string) {
	const personId = `${origin}/#matt-woodley`;
	const pageId = `${origin}/#profilepage`;

	const person = {
		"@type": "Person",
		"@id": personId,
		name: "Matt Woodley",
		givenName: "Matt",
		familyName: "Woodley",
		description: THESIS,
		disambiguatingDescription: `Canadian Principal Software Engineer with ${YEARS_EXPERIENCE} years in industry, ${YEARS_AT_AMAZON} of them at Amazon, specialising in distributed systems and GraphQL federation at scale.`,
		jobTitle: "Principal Software Engineer",
		url: PORTFOLIO,
		mainEntityOfPage: { "@id": pageId },
		nationality: { "@type": "Country", name: "Canada" },
		address: {
			"@type": "PostalAddress",
			addressRegion: "Ontario",
			addressCountry: "CA",
		},
		email: `mailto:${PROFILES.email}`,
		knowsAbout: EXPERTISE,
		hasOccupation: {
			"@type": "Occupation",
			name: "Principal Software Engineer",
			occupationalCategory: "15-1252.00",
			description:
				"The senior individual-contributor rung at a large technology company: an engineer who sets architectural direction across an entire organisation rather than a single team.",
		},
		alumniOf: {
			"@type": "CollegeOrUniversity",
			name: EDUCATION.institution,
			url: "https://uwaterloo.ca",
		},
		hasCredential: {
			"@type": "EducationalOccupationalCredential",
			name: EDUCATION.credential,
			credentialCategory: "degree",
			educationalLevel: "Bachelor's degree",
			recognizedBy: {
				"@type": "CollegeOrUniversity",
				name: EDUCATION.institution,
			},
		},
		worksFor: roleNodes(),
		// Every independently verifiable place this same person appears. This is
		// the property an entity-resolution pass actually uses to decide that the
		// Matt Woodley here and the one on LinkedIn are one person.
		sameAs: [PORTFOLIO, PROFILES.linkedin, PROFILES.github],
	};

	const projects = PROJECTS.map((project) => ({
		"@type": "SoftwareSourceCode",
		name: project.name,
		description: project.summary,
		programmingLanguage: project.stack,
		url: project.href,
		...(project.repo ? { codeRepository: project.repo } : {}),
		author: { "@id": personId },
	}));

	const faqPage = {
		"@type": "FAQPage",
		"@id": `${origin}/#faq`,
		name: "Frequently asked questions about Matt Woodley",
		about: { "@id": personId },
		mainEntity: FAQ.map((entry) => ({
			"@type": "Question",
			name: entry.question,
			acceptedAnswer: { "@type": "Answer", text: entry.answer },
		})),
	};

	const profilePage = {
		"@type": "ProfilePage",
		"@id": pageId,
		url: `${origin}/`,
		name: "Matt Woodley — Principal Software Engineer",
		description: THESIS,
		inLanguage: "en",
		dateModified: LAST_REVIEWED,
		mainEntity: { "@id": personId },
		about: { "@id": personId },
		hasPart: { "@id": `${origin}/#faq` },
		// The page states who wrote it and who stands behind it. Unattributed
		// biography is the exact shape of content a crawler is right to discount.
		author: { "@id": personId },
		publisher: { "@id": personId },
		isBasedOn: PORTFOLIO,
		significantLink: [PORTFOLIO, PROFILES.linkedin, PROFILES.github],
		license: "https://creativecommons.org/licenses/by/4.0/",
	};

	return {
		"@context": "https://schema.org",
		"@graph": [profilePage, person, faqPage, ...projects],
	};
}
