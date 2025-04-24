import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Added currReading variable
let currReading: { ph: number; turbidity: number; created_at: string } | null = null;

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

        const { data, error } = await supabase
            .from('sensor_readings')
            .insert([{ ph, turbidity }])
            .select('ph, turbidity, created_at')
            .maybeSingle(); // fetch inserted row immediately

        if (error || !data) {
            console.error('Supabase insert error:', error);
            return json({ success: false, message: 'Failed to insert into database' }, { status: 500 });
        }

        // Store most recent reading in currReading
        currReading = data;

        return json({ success: true, message: 'Sensor data saved successfully' });

    } catch (err) {
        console.error('Request Processing Error:', err);
        return json({ success: false, message: 'Invalid request body' }, { status: 400 });
    }
}

export async function GET() {

    // Return the most recent reading based on memory
    if (currReading) {
      return json({ success: true, data: currReading });
    }

    return json({ success: false, message: 'No data available' }, { status: 404 });
    
    // Fetches from supabase and returns the most recent reading
    // try {
    //     const { data, error } = await supabase
    //     .from('sensor_readings')
    //     .select('ph, turbidity, created_at')
    //     .order('created_at', { ascending: false })
    //     .limit(1)
    //     .maybeSingle();

    //     if (error) {
    //     console.error('Supabase fetch error:', error);
    //     return json({ success: false, message: 'Failed to fetch data' }, { status: 500 });
    //     }

    //     return json({ success: true, data });
    // } catch (err) {
    //     console.error('Unexpected GET error:', err);
    //     return json({ success: false, message: 'Unexpected error' }, { status: 500 });
    // }
}