// api/send-notification.js
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { targetUid, title, body, url } = req.body;
  if (!targetUid || !title) return res.status(400).json({ error: 'Missing params' });

  const APP_ID = process.env.ONESIGNAL_APP_ID;
  const API_KEY = process.env.ONESIGNAL_REST_API_KEY;

  if (!APP_ID || !API_KEY) {
    return res.status(500).json({ error: 'Missing OneSignal credentials' });
  }

  try {
    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${API_KEY}`
      },
      body: JSON.stringify({
        app_id: APP_ID,
        include_aliases: { external_id: [targetUid] },
        target_channel: 'push',
        headings: { en: title, fr: title },
        contents: { en: body, fr: body },
        url: url || undefined,
        chrome_web_icon: 'https://res.cloudinary.com/cifcliyv/image/upload/icon-192.png',
        chrome_web_badge: 'https://res.cloudinary.com/cifcliyv/image/upload/icon-192.png'
      })
    });
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
