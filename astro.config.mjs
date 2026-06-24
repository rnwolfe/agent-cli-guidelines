// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLlmsTxt from 'starlight-llms-txt';

// https://astro.build/config
// Served at the root of https://aclig.dev — no base path, so internal `/...` links work
// natively (no rehype base-prefixing needed).
export default defineConfig({
	site: 'https://aclig.dev',

	integrations: [
		starlight({
			title: 'Agent CLI Guidelines',
			description:
				'A living, versioned standard for command-line tools designed to be driven by LLM agents — invariants, patterns, antipatterns, and a conformance checklist.',
			components: { Head: './src/components/Head.astro' },
			// Default first-time visitors to the branded dark theme (the toggle still works).
			head: [
				{
					tag: 'script',
					content:
						"try{if(!localStorage.getItem('starlight-theme')){document.documentElement.dataset.theme='dark'}}catch(e){}",
				},
			],
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
						{ label: 'Home', link: '/' },
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
						{ label: 'Get the badge', slug: 'badge' },
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
