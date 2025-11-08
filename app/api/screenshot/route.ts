import { NextRequest, NextResponse } from 'next/server';
import { chromium } from 'playwright';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Missing lat or lon parameters' },
      { status: 400 }
    );
  }

  let browser;
  try {
    // Launch browser
    browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const context = await browser.newContext({
      viewport: { width: 1200, height: 800 },
    });

    const page = await context.newPage();

    // Navigate to earth.nullschool.net with specific coordinates
    const url = `https://earth.nullschool.net/#current/wind/surface/level/orthographic=${lon},${lat},1500`;
    await page.goto(url, { waitUntil: 'networkidle' });

    // Wait a bit for the map to render and animate
    await page.waitForTimeout(3000);

    // Take screenshot
    const screenshot = await page.screenshot({
      type: 'png',
      fullPage: false,
    });

    await browser.close();

    // Return the image
    return new NextResponse(screenshot as unknown as BodyInit, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=60',
      },
    });
  } catch (error: any) {
    console.error('Screenshot error:', error);
    if (browser) {
      await browser.close();
    }
    return NextResponse.json(
      { error: 'Failed to capture screenshot', details: error.message },
      { status: 500 }
    );
  }
}
