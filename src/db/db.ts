import { createClient } from '@supabase/supabase-js';
import type { Database } from '$types/supabase';
import 'dotenv/config';
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
	console.error('Please set SUPABASE_URL and SUPABASE_API in your .env file');
	process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey);

export { supabase };
