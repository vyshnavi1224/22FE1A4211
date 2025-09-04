import { nanoid } from 'nanoid';
import type { ShortUrl, ClickEvent } from './types.js';


const urls = new Map<string, ShortUrl>(); // code -> ShortUrl


// Generate a unique shortcode
export function generateUniqueCode(): string {
let code = nanoid(6);
while (urls.has(code)) code = nanoid(6);
return code;
}


export function isCodeTaken(code: string): boolean {
return urls.has(code);
}


export function createShortUrl(url: string, validityMins: number, code?: string): ShortUrl {
const now = new Date();
const expiresAt = new Date(now.getTime() + validityMins * 60 * 1000);
const finalCode = code ?? generateUniqueCode();


const entry: ShortUrl = {
code: finalCode,
url,
createdAt: now,
expiresAt,
clicks: [],
};
urls.set(finalCode, entry);
return entry;
}


export function getByCode(code: string): ShortUrl | undefined {
return urls.get(code);
}


export function recordClick(code: string, ev: ClickEvent): void {
const item = urls.get(code);
if (item) item.clicks.push(ev);
}