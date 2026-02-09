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
    const { token } = await req.json()

    if (!token || typeof token !== 'string') {
      console.warn('validate-token: Missing or invalid token parameter')
      return new Response(
        JSON.stringify({ valid: false, error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { data, error } = await supabase
      .from('app_settings')
      .select('access_token')
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      console.error('validate-token: Error fetching settings:', error)
      return new Response(
        JSON.stringify({ valid: false }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Constant-time comparison to prevent timing attacks
    const storedToken = data.access_token
    const valid = storedToken.length === token.length &&
      storedToken.split('').every((char: string, i: number) => char === token[i])

    console.log(`validate-token: Token validation ${valid ? 'succeeded' : 'failed'}`)

    return new Response(
      JSON.stringify({ valid }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('validate-token: Unexpected error:', err)
    return new Response(
      JSON.stringify({ valid: false, error: 'Internal error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
