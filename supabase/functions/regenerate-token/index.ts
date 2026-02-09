import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { current_token } = await req.json()

    if (!current_token || typeof current_token !== 'string') {
      console.warn('regenerate-token: Missing or invalid current_token parameter')
      return new Response(
        JSON.stringify({ error: 'Current token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // Fetch current token from the database
    const { data: settings, error: fetchError } = await supabase
      .from('app_settings')
      .select('id, access_token')
      .limit(1)
      .maybeSingle()

    if (fetchError || !settings) {
      console.error('regenerate-token: Error fetching settings:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Failed to validate token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Validate current token before allowing regeneration
    if (settings.access_token !== current_token) {
      console.warn('regenerate-token: Invalid current token provided')
      return new Response(
        JSON.stringify({ error: 'Invalid current token' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate new token
    const array = new Uint8Array(24)
    crypto.getRandomValues(array)
    const newToken = Array.from(array, (b) => b.toString(16).padStart(2, '0')).join('')

    // Update in database
    const { error: updateError } = await supabase
      .from('app_settings')
      .update({ access_token: newToken })
      .eq('id', settings.id)

    if (updateError) {
      console.error('regenerate-token: Error updating token:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to regenerate token' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('regenerate-token: Token regenerated successfully')

    return new Response(
      JSON.stringify({ new_token: newToken }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('regenerate-token: Unexpected error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
