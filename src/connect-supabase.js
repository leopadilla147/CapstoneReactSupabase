import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xeyuorrcgoxvbklyodnf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhleXVvcnJjZ294dmJrbHlvZG5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NjQ1MjcsImV4cCI6MjA2MzM0MDUyN30.U3bk8Q0GwLvNuU1j784gLZOhsezGk2kgx_L9fU0NlEM'

export const supabase = createClient(supabaseUrl, supabaseKey)