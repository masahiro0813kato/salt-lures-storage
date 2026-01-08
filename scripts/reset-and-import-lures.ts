import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';

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

// Generate unique URL code (short hash)
function generateUrlCode(lureId: string, index: number): string {
  const data = `${lureId}-${index}-${Date.now()}`;
  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 8);
}

async function resetAndImportLures() {
  console.log('🚀 Starting lures table reset and import process...\n');

  // Step 1: Delete all records
  console.log('🗑️  Step 1: Deleting all records from lures table...');
  const { error: deleteError } = await supabase
    .from('lures')
    .delete()
    .neq('id', 0); // Delete all records (neq 0 means all)

  if (deleteError) {
    console.error('❌ Error deleting records:', deleteError.message);
    process.exit(1);
  }
  console.log('✅ All records deleted\n');

  // Step 2: Reset ID sequence
  console.log('🔄 Step 2: Resetting ID sequence...');
  const { error: resetError } = await supabase.rpc('reset_lures_id_sequence' as any);

  // If the function doesn't exist, we'll use raw SQL via a different approach
  // For now, let's skip this and let PostgreSQL auto-increment handle it
  console.log('⚠️  Note: ID sequence will auto-adjust on next insert\n');

  // Step 3: Read and parse CSV
  console.log('📖 Step 3: Reading CSV file...');
  const csvPath = path.join(__dirname, 'data', 'lures.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = csvContent.split('\n');

  // Parse header
  const header = lines[0].split(',');
  console.log(`   Found ${lines.length - 1} lines in CSV\n`);

  // Parse data rows
  const lures: any[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parsing (assumes no commas in quoted fields for simplicity)
    const columns = line.split(',');

    // Generate unique url_code if empty
    const lureId = columns[2] || null;
    const urlCode = columns[1] || (lureId ? generateUrlCode(lureId, i) : null);

    const lure = {
      id: parseInt(columns[0]) || null,
      url_code: urlCode,
      lure_id: lureId,
      lure_maker_id: null, // Will be looked up later
      scraping_source_id: columns[4] || null,
      lure_category_id: null, // Will be looked up later
      lure_name_ja: columns[6] || null,
      lure_name_en: columns[7] || null,
      attached_hook_size_1: columns[8] || null,
      attached_hook_size_2: columns[9] || null,
      attached_hook_size_3: columns[10] || null,
      attached_hook_size_4: columns[11] || null,
      attached_hook_size_5: columns[12] || null,
      attached_ring_size: columns[13] || null,
      lure_buoyancy: columns[14] || null,
      lure_action: columns[15] || null,
      lure_length: parseFloat(columns[16]) || null,
      lure_weight: parseFloat(columns[17]) || null,
      lure_range_min: parseFloat(columns[18]) || null,
      lure_range_max: parseFloat(columns[19]) || null,
      lure_information: columns[20] || null,
      is_available: columns[21] === 'TRUE' || columns[21] === 'true',
    };

    // Lookup maker_id by name
    const makerName = columns[3];
    if (makerName) {
      const { data: maker } = await supabase
        .from('lure_makers')
        .select('id')
        .eq('lure_maker_name_en', makerName)
        .single();

      if (maker) {
        lure.lure_maker_id = maker.id;
      }
    }

    // Lookup category_id by name
    const categoryName = columns[5];
    if (categoryName) {
      const { data: category } = await supabase
        .from('lure_categories')
        .select('id')
        .eq('category_name_ja', categoryName)
        .single();

      if (category) {
        lure.lure_category_id = category.id;
      }
    }

    lures.push(lure);
  }

  console.log(`📊 Parsed ${lures.length} lures from CSV\n`);

  // Step 4: Insert data in batches
  console.log('💾 Step 4: Inserting data into database...');
  let successCount = 0;
  let errorCount = 0;
  const batchSize = 10; // Smaller batches due to lookups

  for (let i = 0; i < lures.length; i += batchSize) {
    const batch = lures.slice(i, i + batchSize);
    console.log(`   Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(lures.length / batchSize)}...`);

    const { error } = await supabase
      .from('lures')
      .insert(batch);

    if (error) {
      console.error(`   ❌ Error inserting batch:`, error.message);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
      process.stdout.write(`   ✓ ${successCount}/${lures.length}\r`);
    }
  }

  console.log(`\n\n✅ Import complete!`);
  console.log(`   Success: ${successCount}`);
  console.log(`   Errors: ${errorCount}`);
  console.log(`   Total: ${lures.length}\n`);

  // Step 5: Verify
  console.log('🔍 Verifying import...');
  const { data, error, count } = await supabase
    .from('lures')
    .select('id, lure_id, lure_name_ja', { count: 'exact' });

  if (error) {
    console.error('❌ Verification failed:', error.message);
  } else {
    console.log(`\n✅ Total records in database: ${count}`);
    console.log('\nFirst 5 records:');
    data?.slice(0, 5).forEach((lure) => {
      console.log(`   ID: ${lure.id}, lure_id: ${lure.lure_id}, Name: ${lure.lure_name_ja}`);
    });
  }
}

resetAndImportLures().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
