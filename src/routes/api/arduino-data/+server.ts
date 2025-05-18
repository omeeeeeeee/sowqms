import { json } from '@sveltejs/kit';
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ARDUINO_API_KEY } from '$env/static/private';

// const supabaseUrl = process.env.SUPABASE_URL!;
// const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
// const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Added currReading variable
// let currReading: { ph: number; turbidity: number; created_at: string } | null = null;

export async function POST({ request }) {
    console.log("Received POST request!");
    const X_ARDUINO_API_KEY = request.headers.get("ARDUINO_API_KEY");

    if (ARDUINO_API_KEY !== X_ARDUINO_API_KEY) {
        return json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const raw = await request.text();
        console.log('RAW BODY:', raw);

        const body = JSON.parse(raw);
        console.log('Parsed BODY:', body);

        const { ph, turbidity } = body;

        const location = "281a1180-cbda-4150-a344-fadf02761992";

        if (typeof ph !== 'number' || typeof turbidity !== 'number') {
            console.error('Invalid types:', { phType: typeof ph, turbidityType: typeof turbidity });
            return json({ success: false, message: 'Invalid data format' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('sensor_readings')
            .insert([{ ph, turbidity, location }])
            .select('ph, turbidity, created_at, location')
            .maybeSingle(); // fetch inserted row immediately

        if (error || !data) {
            console.error('Supabase insert error:', error);
            return json({ success: false, message: 'Failed to insert into database' }, { status: 500 });
        }

        // Store most recent reading in currReading
        // currReading = data;

        return json({ success: true, message: 'Sensor data saved successfully' });

    } catch (err) {
        console.error('Request Processing Error:', err);
        return json({ success: false, message: 'Invalid request body' }, { status: 400 });
    }
}

export async function GET({ url }) {
  const from = url.searchParams.get('from');
  const to = url.searchParams.get('to');
  const location = url.searchParams.get('location');
  
  try {
    // Fetch the most recent reading
    let latestQuery = supabase
      .from('sensor_readings')
      .select('ph, turbidity, created_at')
      .order('created_at', { ascending: false })

    if (location) latestQuery = latestQuery.eq('location', location);
    latestQuery = latestQuery.limit(1).maybeSingle();

    const { data: latestReading, error: latestError } = await latestQuery;

    if (latestError) {
      console.error('Supabase latest fetch error:', latestError);
      return json({ success: false, message: 'Failed to fetch latest reading' }, { status: 500 });
    }

    // Fetch readings within date range
    let rangeQuery = supabase
      .from('sensor_readings')
      .select('ph, turbidity, created_at, location')
      .order('created_at', { ascending: true });

    if (from) rangeQuery = rangeQuery.gte('created_at', from);
    if (to) rangeQuery = rangeQuery.lte('created_at', to);
    if (location) rangeQuery = rangeQuery.eq('location', location);

    const { data: rangeReadings, error: rangeError } = await rangeQuery;

    if (rangeError) {
      console.error('Supabase range fetch error:', rangeError);
      return json({ success: false, message: 'Failed to fetch range readings' }, { status: 500 });
    }

    // Fetch locations
    const { data: locations, error: locError } = await supabase
      .from('sensor_locations')
      .select('id, longitude, latitude, name')

    if (locError) {
      console.error('Supabase location fetch error:', locError);
      return json({ success: false, message: 'Failed to fetch locations' }, { status: 500 });
    }

    // Send both as one bigger JSON
    return json({
      success: true,
      latest: latestReading,
      range: rangeReadings,
      locations: locations
    });

  } catch (err) {
    console.error('Unexpected GET error:', err);
    return json({ success: false, message: 'Unexpected server error' }, { status: 500 });
  }
}