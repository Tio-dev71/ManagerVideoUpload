import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const rapidApiKey = process.env.RAPIDAPI_KEY;
    const rapidApiHost = process.env.RAPIDAPI_HOST;

    if (!rapidApiKey || !rapidApiHost) {
      return NextResponse.json(
        { error: 'RapidAPI credentials are not configured' },
        { status: 500 }
      );
    }

    const fetchUrl = `https://${rapidApiHost}/v1/social/autolink`;
    console.log(`[Downloader] Fetching: ${fetchUrl} for ${url}`);

    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-key': rapidApiKey,
        'x-rapidapi-host': rapidApiHost,
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('RapidAPI Error:', errorText);
      return NextResponse.json(
        { error: 'Failed to fetch video data from RapidAPI', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Downloader API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
