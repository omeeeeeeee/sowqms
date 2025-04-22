import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST({ request }) {
  try {
    const body = await request.json();

    if (!body || typeof body.ph !== 'number' || typeof body.turbidity !== 'number') {
      return json({ success: false, message: 'Invalid request body' }, { status: 400 });
    }

    const { error } = await supabase
      .from('sensor_readings')
      .insert([{ ph: body.ph, turbidity: body.turbidity }]);

    if (error) {
      console.error('❌ Supabase error:', error);
      return json({ success: false, message: 'Database error' }, { status: 500 });
    }

    return json({ success: true });
  } catch (err) {
    console.error('❌ General error:', err);
    return json({ success: false, message: 'Unexpected error' }, { status: 500 });
  }
}
