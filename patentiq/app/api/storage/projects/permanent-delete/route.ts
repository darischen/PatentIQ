import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth/auth0';

/**
 * POST /api/storage/projects/permanent-delete - Permanently delete a project from trash
 */

export async function POST(req: NextRequest) {
  const backend = req.headers.get('X-Requested-Backend') || 'localStorage';
  const { projectId } = await req.json();

  try {
    if (backend === 'supabase') {
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
          .delete()
          .eq('id', projectId)
          .eq('user_id', userId);

        if (!error) {
          return NextResponse.json({ success: true });
        } else {
          console.error('Supabase permanent delete error:', error);
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
