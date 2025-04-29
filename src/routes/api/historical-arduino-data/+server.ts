import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL , SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private'

const supabase = createClient(
  SUPABASE_URL!,
  SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET({ url }) {
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');

  try {
    let query = supabase
      .from('sensor_readings')
      .select('ph, turbidity, created_at')
      .order('created_at', { ascending: true });

    // Apply date filtering if provided
    if (from) {
      query = query.gte('created_at', from);
    }
    if (to) {
      query = query.lte('created_at', to);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase fetch error:', error);
      return json({ success: false, message: 'Failed to fetch data' }, { status: 500 });
    }

    return json({ success: true, data });
  } catch (err) {
    console.error('Unexpected GET error:', err);
    return json({ success: false, message: 'Unexpected error' }, { status: 500 });
  }
}