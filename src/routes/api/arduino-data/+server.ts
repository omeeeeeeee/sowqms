import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST({ request }) {
    console.log("Received POST request!");

    try {
        const raw = await request.text();
        console.log('RAW BODY:', raw);

        const body = JSON.parse(raw);
        console.log('Parsed BODY:', body);

        const { ph, turbidity } = body;

        if (typeof ph !== 'number' || typeof turbidity !== 'number') {
            console.error('Invalid types:', { phType: typeof ph, turbidityType: typeof turbidity });
            return json({ success: false, message: 'Invalid data format' }, { status: 400 });
        }

        const { error } = await supabase
            .from('sensor_readings')
            .insert([{ ph, turbidity }]);

        if (error) {
            console.error('Supabase insert error:', error);
            return json({ success: false, message: 'Failed to insert into database' }, { status: 500 });
        }

        return json({ success: true, message: 'Sensor data saved successfully' });

    } catch (err) {
        console.error('Request Processing Error:', err);
        return json({ success: false, message: 'Invalid request body' }, { status: 400 });
    }
}