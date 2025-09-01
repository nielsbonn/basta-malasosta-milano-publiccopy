
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { getPoliceEmail } from "./utils.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailData {
  userEmail: string;
  violationType: string;
  location: {
    coords: GeolocationCoordinates;
    address: string;
    municipio: string;
    geocoding: any;
  };
  photo: string;
  timestamp: string;
  addressSubject: string;
}

const formatDateTime = (timestamp: string): string => {
  const [date, time] = timestamp.split(' ');
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}, ${time.slice(0, 5)}`;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, violationType, location, photo, timestamp, addressSubject }: EmailData = await req.json();

    console.log('Received email data:', {
      addressSubject,
      fullAddress: location.address,
      timestamp,
      municipio: location.municipio
    });

    // Get the police email address based on the municipio
    const policeEmail = getPoliceEmail(location.municipio);
    console.log('Determined police email:', policeEmail);

    if (policeEmail === 'Email non disponibile') {
      throw new Error('Non è stato possibile determinare l\'indirizzo email della Polizia Locale per questo municipio.');
    }

    const formattedDateTime = formatDateTime(timestamp);

    const { data, error: emailError } = await resend.emails.send({
      from: 'Basta Malasosta <segnalazioni@milano.mobilita-sicura.eu>',
      to: [policeEmail],
      cc: [userEmail],
      subject: `Segnalazione sosta irregolare - ${addressSubject}`,
      attachments: [
        {
          filename: 'violazione.jpg',
          content: photo.split('base64,')[1],
        },
      ],
      html: `
        <p>Buongiorno,</p>
        <p>A nome dell'utente ${userEmail} (in copia a questa mail), desideriamo segnalare un veicolo parcheggiato illegalmente (su ${violationType}) presso il seguente indirizzo:</p>
        <p>
          <strong>Indirizzo:</strong> ${location.address}<br>
          <strong>Data e ora della segnalazione:</strong> ${formattedDateTime}
        </p>
        <p>In allegato una foto a dimostrazione della violazione.</p>
        <p>Chiediamo gentilmente di intensificare i controlli in questa zona.</p>
        <p>Per una visione completa delle aree problematiche, è possibile consultare la mappa disponibile nel nostro app: <a href="https://basta-malasosta-milano.lovable.app/">https://basta-malasosta-milano.lovable.app/</a></p>
        <p>Cordiali saluti,</p>
        <p style="margin-top: 30px; font-weight: bold;">Basta Malasosta Milano</p>
        <hr style="margin-top: 30px; margin-bottom: 30px;">
        <p style="font-size: 0.9em; color: #666;">Non rispondere a questa mail, l'indirizzo del mittente non è monitorato. Per domande relative a questa segnalazione, si prega di contattare l'utente responsabile: <a href="mailto:${userEmail}">${userEmail}</a> (in copia a questa mail).</p>
      `,
    });

    if (emailError) {
      throw emailError;
    }

    console.log('Email sent successfully:', data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error: any) {
    console.error('Error in send-violation-report function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': "application/json" },
        status: 500 
      }
    );
  }
};

serve(handler);
