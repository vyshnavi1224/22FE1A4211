import { z } from 'zod';


export const createShortUrlSchema = z.object({
url: z.string().url({ message: 'url must be a valid URL' }),
validity: z.number().int().positive().optional(),
shortcode: z.string().regex(/^[a-zA-Z0-9_-]{3,20}$/).optional(),
});


export type CreateShortUrlInput = z.infer<typeof createShortUrlSchema>;