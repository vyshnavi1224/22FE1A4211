import fetch from 'node-fetch';


const AM_BASE = process.env.AM_BASE_URL!; // e.g., http://20.244.56.144/evaluation-service


let cachedToken: string | null = null;
let tokenExpiryEpoch: number | null = null;


export async function ensureAuthToken(): Promise<string> {
const now = Math.floor(Date.now() / 1000);
if (cachedToken && tokenExpiryEpoch && now < tokenExpiryEpoch - 60) {
return cachedToken;
}


const res = await fetch(`${AM_BASE}/auth`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({
email: process.env.AM_EMAIL,
name: process.env.AM_NAME,
rollNo: process.env.AM_ROLLNO,
accessCode: process.env.AM_ACCESS_CODE,
clientID: process.env.AM_CLIENT_ID,
clientSecret: process.env.AM_CLIENT_SECRET,
}),
});


if (!res.ok) {
const msg = await res.text();
throw new Error(`Auth failed: ${res.status} ${msg}`);
}


const data = (await res.json()) as {
token_type: string; access_token: string; expires_in: number;
};


cachedToken = data.access_token;
tokenExpiryEpoch = data.expires_in; // server provides epoch seconds per screenshots
return cachedToken!;
}


export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogStack = 'backend' | 'frontend';
export type LogPackage =
| 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler' | 'repository' | 'route' | 'service'
| 'api' | 'component' | 'hook' | 'page' | 'state' | 'style' | 'auth' | 'config' | 'middleware' | 'utils';


export async function Log(stack: LogStack, level: LogLevel, pkg: LogPackage, message: string) {
try {
const token = await ensureAuthToken();
const res = await fetch(`${AM_BASE}/logs`, {
method: 'POST',
headers: {
'Authorization': `Bearer ${token}`,
'Content-Type': 'application/json',
},
body: JSON.stringify({ stack, level, package: pkg, message }),
});


if (!res.ok) {
// Best-effort logging; do not crash the API
const text = await res.text();
console.error('Log failed', res.status, text);
}
} catch (err) {
console.error('Log error', (err as Error).message);
}
}