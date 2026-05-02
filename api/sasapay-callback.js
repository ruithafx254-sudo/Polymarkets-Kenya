import { createClient } from '@supabase/supabase-js'

// Initialize Supabase using environment variables
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  // Only accept POST requests from SasaPay
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const body = req.body
    console.log("SasaPay Callback Data Received:", body)

    // ResultCode "0" means the transaction was successful
    const resultCode = String(body.ResultCode)
    const amount = parseFloat(body.TransAmount)
    const reference = body.BillRefNumber || '' 

    // Extract user email from the reference (e.g., TX-user@email.com-12345)
    const userEmail = reference.split('-')[1]

    if (resultCode === '0' && userEmail) {
      // 1. Find the user profile by email
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('id, balance')
        .eq('email', userEmail)
        .single()

      if (fetchError || !profile) {
        throw new Error(`Profile not found for email: ${userEmail}`)
      }

      // 2. Calculate the new user balance
      const currentBalance = parseFloat(profile.balance || 0)
      const newBalance = currentBalance + amount

      // 3. Update the database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ balance: newBalance, updated_at: new Date().toISOString() })
        .eq('id', profile.id)

      if (updateError) throw updateError

      console.log(`Success: Added KES ${amount} to balance for ${userEmail}`)
    }

    // Always respond to SasaPay with a success code to prevent them from retrying
    return res.status(200).json({ 
      statusCode: "0", 
      statusMessage: "Callback processed successfully" 
    })

  } catch (err) {
    console.error("Callback processing error:", err.message)
    return res.status(400).json({ error: err.message })
  }
}
