import { NextRequest, NextResponse } from 'next/server';
import { auth0 } from '@/lib/auth/auth0';

/**
 * GET /api/storage/trash - Load trash items for authenticated user
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
          .not('deleted_at', 'is', null);

        if (!error && data) {
          return NextResponse.json(data);
        }
      } catch (err) {
        console.error('Supabase error:', err);
      }
    }

    // Fallback - return empty, client will use localStorage
    return NextResponse.json([]);
  } catch (error) {
    console.error('Storage API error:', error);
    return NextResponse.json({ error: 'Storage error' }, { status: 500 });
  }
}
