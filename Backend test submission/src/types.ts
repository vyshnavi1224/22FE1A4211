export interface CreateShortUrlBody {
url: string;
validity?: number; // minutes, default 30
shortcode?: string; // optional custom
}


export interface ShortUrl {
code: string;
url: string;
createdAt: Date;
expiresAt: Date; // based on validity
clicks: ClickEvent[];
}


export interface ClickEvent {
at: Date;
referrer: string | null;
ip: string | null;
geo: {
country?: string; // coarse location placeholder
};
}