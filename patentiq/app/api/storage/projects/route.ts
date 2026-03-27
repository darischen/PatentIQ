import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/storage/projects - Load all projects
 * POST /api/storage/projects - Add a project
 * PUT /api/storage/projects - Update a project
 */

export async function GET(req: NextRequest) {
  const backend = req.headers.get('X-Requested-Backend') || 'localStorage';

  try {
    if (backend === 'supabase') {
      // Try Supabase
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .is('deleted_at', null);

        if (!error && data) {
          return NextResponse.json(data);
        }
      } catch (err) {
        console.error('Supabase error:', err);
      }
    }

    if (backend === 'docker' || backend === 'supabase') {
      // Try Docker PostgreSQL via direct query
      try {
        // Note: This would need a backend connection pool
        // For now, return empty to fallback to localStorage
        return NextResponse.json({ error: 'Docker not configured' }, { status: 503 });
      } catch (err) {
        console.error('Docker error:', err);
      }
    }

    // Fallback - return empty, client will use localStorage
    return NextResponse.json([]);
  } catch (error) {
    console.error('Storage API error:', error);
    return NextResponse.json({ error: 'Storage error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const backend = req.headers.get('X-Requested-Backend') || 'localStorage';
  const project = await req.json();

  try {
    if (backend === 'supabase') {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { error } = await supabase
          .from('projects')
          .insert([project]);

        if (!error) {
          return NextResponse.json({ success: true });
        }
      } catch (err) {
        console.error('Supabase error:', err);
      }
    }

    // Fallback - let client save to localStorage
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Storage API error:', error);
    return NextResponse.json({ error: 'Storage error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const backend = req.headers.get('X-Requested-Backend') || 'localStorage';
  const project = await req.json();

  try {
    if (backend === 'supabase') {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { error } = await supabase
          .from('projects')
          .update(project)
          .eq('id', project.id);

        if (!error) {
          return NextResponse.json({ success: true });
        }
      } catch (err) {
        console.error('Supabase error:', err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Storage API error:', error);
    return NextResponse.json({ error: 'Storage error' }, { status: 500 });
  }
}
