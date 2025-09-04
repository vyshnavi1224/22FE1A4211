import 'dotenv/config';


return res.redirect(item.url);
} catch (err) {
await Log('backend', 'error', 'handler', `redirect error: ${(err as Error).message}`);
return res.status(500).json({ error: 'internal server error' });
}
});


/**
* Retrieve Short URL Statistics – GET /shorturls/:code
* Response includes:
* - total clicks
* - original URL, creation date, expiry date
* - detailed click list [{ timestamp, referrer, geo }]
*/
app.get('/shorturls/:code', async (req, res) => {
try {
const code = req.params.code;
const item = getByCode(code);
if (!item) {
await Log('backend', 'warn', 'repository', `stats unknown code ${code}`);
return res.status(404).json({ error: 'shortcode not found' });
}


const stats = {
code: item.code,
url: item.url,
createdAt: item.createdAt.toISOString(),
expiry: item.expiresAt.toISOString(),
totalClicks: item.clicks.length,
clicks: item.clicks.map(c => ({
timestamp: c.at.toISOString(),
referrer: c.referrer,
geo: c.geo,
})),
};


await Log('backend', 'info', 'service', `stats requested for ${code}`);
return res.json(stats);
} catch (err) {
await Log('backend', 'error', 'handler', `stats error: ${(err as Error).message}`);
return res.status(500).json({ error: 'internal server error' });
}
});


app.listen(PORT, async () => {
// Warm up logging token on boot (non-fatal if it fails; will retry on first log)
try { await Log('backend', 'info', 'config', `server up on ${HOSTNAME}`); } catch {}
console.log(`URL Shortener running at ${HOSTNAME}`);
});
