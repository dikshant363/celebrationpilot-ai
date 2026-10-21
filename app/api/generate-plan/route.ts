import { NextRequest, NextResponse } from 'next/server';
import { validateEventBrief } from '@/lib/validation/eventBriefSchema';
import { generateEventPlanWithGemini } from '@/lib/ai/gemini';

export async function POST(req: NextRequest) {
  try {
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 32768) {
      return NextResponse.json(
        { error: 'Payload too large. Maximum allowed size is 32KB.' },
        { status: 413 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'Malformed or invalid JSON payload' },
        { status: 400 }
      );
    }

    const validation = validateEventBrief(body);
    if (!validation.isValid || !validation.sanitized) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const userApiKey = req.headers.get('x-gemini-api-key') || undefined;
    const planSuite = await generateEventPlanWithGemini(validation.sanitized, userApiKey);

    return NextResponse.json(planSuite, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('[API /api/generate-plan Error]', error);
    return NextResponse.json(
      { error: 'Internal server error while formulating celebration plan.' },
      { status: 500 }
    );
  }
}
