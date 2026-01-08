import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkUrlCodes() {
  const { data, error } = await supabase
    .from('lures')
    .select('id, url_code, lure_id, lure_name_ja')
    .order('id', { ascending: true })
    .limit(10);

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Sample url_code values:\n');
  data?.forEach((lure) => {
    console.log(`ID: ${lure.id}, url_code: "${lure.url_code}", lure_id: ${lure.lure_id}, Name: ${lure.lure_name_ja}`);
  });
}

checkUrlCodes();
