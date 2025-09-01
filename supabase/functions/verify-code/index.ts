import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const generateOTP = (email: string, timeSlot: number) => {
  // Create a deterministic hash based on email and time slot
  const encoder = new TextEncoder();
  const data = encoder.encode(`${email}-${timeSlot}-verificationSalt`);
  const hashBuffer = crypto.subtle.digestSync("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Take first 6 digits of the hash
  return hashHex.split("").filter(char => /\d/.test(char)).slice(0, 6).join("");
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, code } = await req.json();
    console.log(`Verifying code for email: ${email}`);

    // Verify code format
    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      console.log('Invalid code format');
      return new Response(
        JSON.stringify({ error: "Invalid code format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Check current and previous time slot to allow for slight delays
    const currentTimeSlot = Math.floor(Date.now() / (5 * 60 * 1000));
    const previousTimeSlot = currentTimeSlot - 1;

    const currentCode = generateOTP(email, currentTimeSlot);
    const previousCode = generateOTP(email, previousTimeSlot);

    console.log('Checking code against:', { currentCode, previousCode });

    if (code === currentCode || code === previousCode) {
      console.log('Code verified successfully');
      return new Response(
        JSON.stringify({ success: true }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log('Invalid code provided');
    return new Response(
      JSON.stringify({ error: "Invalid code" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error('Error in verify-code function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);