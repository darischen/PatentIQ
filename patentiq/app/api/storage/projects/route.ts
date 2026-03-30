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
      let userId: string | undefined;
      try {
        const session = await auth0.getSession();
        userId = session?.user?.sub;
      } catch (err) {
        console.warn('Failed to get Auth0 session:', err);
        // If no session, return empty array (will fallback to localStorage)
        return NextResponse.json([]);
      }

      if (!userId) {
        return NextResponse.json([]);
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
          // Convert snake_case from DB to camelCase for frontend
          const projects = data.map((p: any) => ({
            id: p.id,
            name: p.name,
            createdAt: p.created_at,
            updatedAt: p.updated_timestamp,
            thumbnail: p.thumbnail,
            analysisResult: p.analysis_result,
            chatHistory: p.chat_history,
          }));
          return NextResponse.json(projects);
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
      let userId: string | undefined;
      try {
        const session = await auth0.getSession();
        userId = session?.user?.sub;
      } catch (err) {
        console.warn('Failed to get Auth0 session:', err);
        // If no session, fallback to localStorage
        return NextResponse.json({ success: true });
      }

      if (!userId) {
        return NextResponse.json({ success: true });
      }

      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Only save columns that exist in the database (convert camelCase to snake_case)
        const projectWithUser = {
          id: project.id,
          name: project.name,
          user_id: userId,
          created_at: project.createdAt,
          updated_timestamp: new Date().toISOString(),
          thumbnail: project.thumbnail,
          analysis_result: project.analysisResult,
          chat_history: project.chatHistory,
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
      let userId: string | undefined;
      try {
        const session = await auth0.getSession();
        userId = session?.user?.sub;
      } catch (err) {
        console.warn('Failed to get Auth0 session:', err);
        // If no session, fallback to localStorage
        return NextResponse.json({ success: true });
      }

      if (!userId) {
        return NextResponse.json({ success: true });
      }

      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        // Only update columns that exist in the database (convert camelCase to snake_case)
        const updateData = {
          name: project.name,
          thumbnail: project.thumbnail,
          analysis_result: project.analysisResult,
          chat_history: project.chatHistory,
          updated_timestamp: new Date().toISOString(),
        };

        const { error } = await supabase
          .from('projects')
          .update(updateData)
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
