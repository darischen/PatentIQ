import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth/auth0';

/**
 * POST /api/storage/save - Save complete state (projects, trash, user)
 * This is a batch operation that delegates to individual endpoints
 */

export async function POST(req: NextRequest) {
  const backend = req.headers.get('X-Requested-Backend') || 'localStorage';
  const state = await req.json();

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

        // Save projects (active ones only)
        if (state.projects && Array.isArray(state.projects)) {
          for (const project of state.projects) {
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
              .upsert([projectWithUser], { onConflict: 'id' });

            if (error) {
              console.error('Failed to save project:', error);
            }
          }
        }

        // Note: Trash items are handled by deleteProject with deleted_at timestamp
        // User is stored in Auth0, not in the database

        return NextResponse.json({ success: true });
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
