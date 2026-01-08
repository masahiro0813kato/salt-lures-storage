import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface LureCSVRow {
  id: number;
  lure_id: string;
}

async function updateLureIds() {
  console.log('🚀 Starting lure_id update process...\n');

  // Read CSV file
  const csvPath = path.join(__dirname, 'data', 'lures.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');

  // Parse CSV (skip header)
  const lures: LureCSVRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const columns = line.split(',');
    const id = parseInt(columns[0]);
    const lure_id = columns[2]; // 3rd column is lure_id

    if (!id || !lure_id) {
      console.warn(`⚠️  Skipping line ${i + 1}: Missing id or lure_id`);
      continue;
    }

    lures.push({ id, lure_id });
  }

  console.log(`📊 Found ${lures.length} lures in CSV\n`);

  // Update database in batches
  let successCount = 0;
  let errorCount = 0;
  const batchSize = 50;

  for (let i = 0; i < lures.length; i += batchSize) {
    const batch = lures.slice(i, i + batchSize);
    console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(lures.length / batchSize)}...`);

    for (const lure of batch) {
      const { error } = await supabase
        .from('lures')
        .update({ lure_id: lure.lure_id })
        .eq('id', lure.id);

      if (error) {
        console.error(`   ❌ Error updating lure ${lure.id}:`, error.message);
        errorCount++;
      } else {
        successCount++;
        if (successCount % 10 === 0) {
          process.stdout.write(`   ✓ ${successCount}/${lures.length}\r`);
        }
      }
    }
  }

  console.log(`\n\n✅ Update complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total: ${lures.length}\n`);

  // Verify a few records
  console.log('🔍 Verifying updates...');
  const { data, error } = await supabase
    .from('lures')
    .select('id, lure_id, lure_name_ja')
    .limit(5);

  if (error) {
    console.error('❌ Verification failed:', error.message);
  } else {
    console.log('\nSample records:');
    data?.forEach((lure) => {
      console.log(`   ID: ${lure.id}, lure_id: ${lure.lure_id}, Name: ${lure.lure_name_ja}`);
    });
  }
}

updateLureIds().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
