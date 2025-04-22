import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

// Create the Supabase client using environment variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export async function POST({ request }) {
    console.log("hi");
    try {
        const text = await request.text();  // <-- read raw body
        console.log('RAW BODY:', text);

        // Parse the JSON body sent by Arduino
        const body = await request.json();
        console.log('PARSED BODY:', body);

        const { ph, turbidity } = body;
        

        if (typeof ph !== 'number' || typeof turbidity !== 'number') {
        return json({ success: false, message: 'Invalid data format' }, { status: 400 });
        }

        // Insert the new sensor data into the sensor_readings table
        const { error } = await supabase
        .from('sensor_readings')
        .insert([
            { ph, turbidity } // matches your table fields
        ]);

        if (error) {
        console.error('Supabase Insert Error:', error);
        return json({ success: false, message: 'Failed to insert into database' }, { status: 500 });
        }

        return json({ success: true, message: 'Sensor data saved successfully' });
    } catch (err) {
        console.error('Request Processing Error:', err);
        return json({ success: false, message: 'Invalid request body' }, { status: 400 });
    }
}
