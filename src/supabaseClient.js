import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://fewypdgfqcncydhsfdcd.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZld3lwZGdmcWNuY3lkaHNmZGNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5NTY5ODUsImV4cCI6MjA3OTUzMjk4NX0.vbiHBwInVLF2cxnm9fBzm7tIQyze0pVqpgDcQIkbwgc'

export const supabase = createClient(supabaseUrl, supabaseKey)