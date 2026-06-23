import { defineCollection } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { z } from 'astro:schema'; // `z` re-exported from 'astro:content' is deprecated

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				owner: z.string().optional(),
				lastReviewed: z.coerce.date().optional(),
			}),
		}),
	}),
};
