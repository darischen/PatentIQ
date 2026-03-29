import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/storage/test - Test which storage backend is available
 */

export async function POST(req: NextRequest) {
  const { backend } = await req.json();

  try {
    if (backend === 'supabase') {
      // Test Supabase connection
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return NextResponse.json({ available: false }, { status: 503 });
      }

      try {
        const { createClient } = await import('@supabase/supabase-js');
        // Use service role key for testing (has full access)
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        );

        // Try a simple query
        const { data, error } = await supabase.from('projects').select('id').limit(1);

        if (!error) {
          return NextResponse.json({ available: true, backend: 'supabase' });
        } else {
          console.error('Supabase query error:', error);
          return NextResponse.json({ available: false, error: error.message }, { status: 503 });
        }
      } catch (err) {
        console.error('Supabase test exception:', err);
        return NextResponse.json({ available: false }, { status: 503 });
      }
    }

    if (backend === 'docker') {
      // Test Docker PostgreSQL connection
      // For now, we'll consider it unavailable since it needs server-side setup
      // In production, you'd connect to the Docker DB here
      return NextResponse.json({ available: false }, { status: 503 });
    }

    return NextResponse.json({ available: false }, { status: 400 });
  } catch (error) {
    console.error('Storage test error:', error);
    return NextResponse.json({ available: false }, { status: 500 });
  }
}
