// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';
import { visit } from 'unist-util-visit';

const BASE = '/agent-cli-guidelines';

// Starlight base-prefixes its own nav + assets, but NOT hand-written absolute links in Markdown
// content. Prefix internal `/...` links with the base so cross-links work on the project Pages site
// while source links stay clean/portable.
function rehypeBaseLinks() {
	return (/** @type {any} */ tree) => {
		visit(tree, 'element', (/** @type {any} */ node) => {
			if (node.tagName !== 'a') return;
			const href = node.properties?.href;
			if (typeof href !== 'string') return;
			if (href.startsWith('/') && !href.startsWith('//') && !href.startsWith(BASE + '/') && href !== BASE) {
				node.properties.href = BASE + href;
			}
		});
	};
}

// https://astro.build/config
export default defineConfig({
	site: 'https://rnwolfe.github.io',
	base: BASE,
	markdown: { rehypePlugins: [rehypeBaseLinks] },

	integrations: [
		starlight({
			title: 'Agent CLI Guidelines',
			description:
				'A living, versioned standard for command-line tools designed to be driven by LLM agents — invariants, patterns, antipatterns, and a conformance checklist.',
			social: [
				{ icon: 'github', label: 'GitHub', href: 'https://github.com/rnwolfe/agent-cli-guidelines' },
			],
			editLink: { baseUrl: 'https://github.com/rnwolfe/agent-cli-guidelines/edit/main/' },
			lastUpdated: true,
			customCss: ['./src/styles/custom.css'],
			expressiveCode: {
				themes: ['github-dark', 'github-light'],
				styleOverrides: { borderRadius: '0.5rem' },
			},
			sidebar: [
				{
					label: 'Start here',
					items: [
						{ label: 'Introduction', slug: 'index' },
						{ label: 'Philosophy', slug: 'philosophy' },
					],
				},
				{
					label: 'The guidelines',
					items: [
						{ label: 'Invariants (the core)', slug: 'invariants' },
						{ label: 'Foundations: output, errors, exit codes', slug: 'foundations' },
						{ label: 'Safety & mutation control', slug: 'safety' },
						{ label: 'Self-description', slug: 'self-description' },
						{ label: 'Token & context economy', slug: 'economy' },
						{ label: 'Auth & secrets', slug: 'auth' },
						{ label: 'Antipatterns', slug: 'antipatterns' },
					],
				},
				{
					label: 'Adopt & evolve',
					items: [
						{ label: 'Conformance', slug: 'conformance' },
						{ label: 'Evolution & governance', slug: 'evolution' },
						{ label: 'Prior art & credits', slug: 'prior-art' },
					],
				},
			],
			plugins: [
				starlightLlmsTxt({
					projectName: 'Agent CLI Guidelines',
					description:
						'A living, versioned standard for command-line tools designed to be driven by LLM ' +
						'agents: read-only-by-default safety, machine-readable self-description, structured ' +
						'errors and exit codes, bounded/token-efficient output, prompt-injection fencing, and ' +
						'agent-completable auth — with patterns, named antipatterns, and a conformance checklist.',
				}),
			],
		}),
	],
});
