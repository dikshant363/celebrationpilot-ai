import { NextRequest, NextResponse } from 'next/server';
import { validateEventBrief, validateCustomApiKey } from '@/lib/validation/eventBriefSchema';
import { generateEventPlanWithGemini } from '@/lib/ai/gemini';
import { checkRateLimit } from '@/lib/security/rateLimiter';

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting
    const forwardedFor = req.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : '127.0.0.1';
    const rateLimit = checkRateLimit(clientIp, 20, 60000);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'Too many requests. Please wait before generating another celebration plan.',
          retryAfter: rateLimit.resetSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetSeconds),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // 2. Request payload size boundary (32KB)
    const contentLength = req.headers.get('content-length');
    if (contentLength && parseInt(contentLength, 10) > 32768) {
      return NextResponse.json(
        { error: 'Payload too large. Maximum allowed size is 32KB.' },
        { status: 413 }
      );
    }

    let rawText: string;
    try {
      rawText = await req.text();
    } catch {
      return NextResponse.json(
        { error: 'Failed to read request body.' },
        { status: 400 }
      );
    }

    if (rawText.length > 32768) {
      return NextResponse.json(
        { error: 'Payload too large. Maximum allowed size is 32KB.' },
        { status: 413 }
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: 'Malformed or invalid JSON payload' },
        { status: 400 }
      );
    }

    // 3. Schema validation & input sanitization
    const validation = validateEventBrief(body);
    if (!validation.isValid || !validation.sanitized) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // 4. API Key Header Validation
    const rawApiKey = req.headers.get('x-gemini-api-key') || undefined;
    const apiKeyValidation = validateCustomApiKey(rawApiKey);
    if (!apiKeyValidation.isValid) {
      return NextResponse.json(
        { error: apiKeyValidation.error },
        { status: 400 }
      );
    }

    // 5. Generate plan with Gemini or deterministic fallback
    const planSuite = await generateEventPlanWithGemini(
      validation.sanitized,
      apiKeyValidation.sanitized
    );

    return NextResponse.json(planSuite, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
        'X-RateLimit-Limit': String(rateLimit.limit),
        'X-RateLimit-Remaining': String(rateLimit.remaining),
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
