export default {
  async fetch(request) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxTWW2TDuU3_5O72hCQ9eQy8hXcg4nwpWkbDp_WU93FRmxvqCM7A6L4zEo0m2Gu1p9j0A/exec';

    const body = await request.text();

    const upstream = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
      redirect: 'follow'
    });

    const text = await upstream.text();

    return new Response(text, {
      status: upstream.status,
      headers: {
        'Content-Type': upstream.headers.get('Content-Type') || 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
};
