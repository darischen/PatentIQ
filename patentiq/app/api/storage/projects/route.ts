import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth/auth0';

/**
 * GET /api/storage/projects - Load all projects for authenticated user
 * POST /api/storage/projects - Add a project
 * PUT /api/storage/projects - Update a project
 */

export async function GET(req: NextRequest) {
  const backend = req.headers.get('X-Requested-Backend') || 'localStorage';

  try {
    if (backend === 'supabase') {
      // Get Auth0 session for user_id
      const session = await auth0.getSession();
      const userId = session?.user?.sub;

      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', userId)
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
      // Get Auth0 session for user_id
      const session = await auth0.getSession();
      const userId = session?.user?.sub;

      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const projectWithUser = {
          ...project,
          user_id: userId,
        };

        const { error } = await supabase
          .from('projects')
          .insert([projectWithUser]);

        if (!error) {
          return NextResponse.json({ success: true });
        } else {
          console.error('Supabase insert error:', error);
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      } catch (err) {
        console.error('Supabase error:', err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
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
      // Get Auth0 session for user_id
      const session = await auth0.getSession();
      const userId = session?.user?.sub;

      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { error } = await supabase
          .from('projects')
          .update(project)
          .eq('id', project.id)
          .eq('user_id', userId);

        if (!error) {
          return NextResponse.json({ success: true });
        } else {
          console.error('Supabase update error:', error);
          return NextResponse.json({ error: error.message }, { status: 400 });
        }
      } catch (err) {
        console.error('Supabase error:', err);
        return NextResponse.json({ error: String(err) }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Storage API error:', error);
    return NextResponse.json({ error: 'Storage error' }, { status: 500 });
  }
}
