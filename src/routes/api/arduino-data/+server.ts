import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // this key must stay server-side only
);

export async function POST({ request }) {
  const body = await request.json();
  const { ph, turbidity } = body;

  const { data, error } = await supabase
    .from('sensor_readings')
    .insert([{ ph, turbidity }]);

  if (error) {
    console.error('Supabase insert error', error);
    return json({ success: false }, { status: 500 });
  }

  return json({ success: true });
}