import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const generateOTP = (email: string) => {
  // Round to nearest 5 minutes to give users time to enter the code
  const timeSlot = Math.floor(Date.now() / (5 * 60 * 1000));
  
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
  console.log("Received request:", req.method);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (!RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not set");
    return new Response(
      JSON.stringify({ error: "Email service not configured" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    const { email } = await req.json();
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log(`Generating verification code for ${email}`);
    const otp = generateOTP(email);

    console.log("Sending email via Resend API");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Basta Malasosta <verification@milano.mobilita-sicura.eu>",
        to: [email],
        subject: `${otp} è il tuo codice di verifica - Basta Malasosta`,
        html: `
          <h1>Il tuo codice di verifica</h1>
          <p>Usa questo codice per accedere all'applicazione:</p>
          <h2 style="font-size: 24px; letter-spacing: 2px;">${otp}</h2>
          <p>Il codice scadrà tra 5 minuti.</p>
          <br/>
          <p style="margin-top: 30px; font-weight: bold;">Basta Malasosta Milano</p>
          <p><a href="http://milano.mobilita-sicura.eu/" style="color: #0066cc; text-decoration: underline;">http://milano.mobilita-sicura.eu/</a></p>
        `,
        text: `Il tuo codice di verifica

Usa questo codice per accedere all'applicazione:

${otp}

Il codice scadrà tra 5 minuti.

Basta Malasosta Milano
http://milano.mobilita-sicura.eu/`,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Failed to send email:', errorText);
      throw new Error("Failed to send email: " + errorText);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error('Error in send-verification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);