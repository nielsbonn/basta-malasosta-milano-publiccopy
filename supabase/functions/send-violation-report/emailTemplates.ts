
import { ViolationReport } from './types.ts';
import { formatDateTimeItalian, getPoliceEmail } from './utils.ts';
import { violationTypeMap } from './types.ts';

export const generateEmailContent = (report: ViolationReport) => {
  const violationTypeItalian = violationTypeMap[report.violationType] || 'violazione non specificata';
  const formattedDateTime = formatDateTimeItalian(report.timestamp);

  const html = `
    <p>Buongiorno,</p>
    <p>A nome dell'utente ${report.userEmail} (in copia a questa mail), desideriamo segnalare un veicolo parcheggiato illegalmente (su ${violationTypeItalian}) presso il seguente indirizzo:</p>
    <p>
      <strong>Indirizzo:</strong> ${report.address}<br>
      <strong>Data e ora della segnalazione:</strong> ${formattedDateTime}
    </p>
    <p>In allegato una foto a dimostrazione della violazione.</p>
    <p>Chiediamo gentilmente di intensificare i controlli in questa zona.</p>
    <p>Per una visione completa delle aree problematiche, è possibile consultare la mappa disponibile nel nostro app: <a href="https://basta-malasosta-milano.lovable.app/">https://basta-malasosta-milano.lovable.app/</a></p>
    <p>Cordiali saluti,</p>
    <p style="margin-top: 30px; font-weight: bold;">Basta Malasosta Milano</p>
    <hr style="margin-top: 30px; margin-bottom: 30px;">
    <p style="font-size: 0.9em; color: #666;">Non rispondere a questa mail, l'indirizzo del mittente non è monitorato. Per domande relative a questa segnalazione, si prega di contattare l'utente responsabile: <a href="mailto:${report.userEmail}">${report.userEmail}</a> (in copia a questa mail).</p>
  `;

  const text = `
Buongiorno,

A nome dell'utente ${report.userEmail} (in copia a questa mail), desideriamo segnalare un veicolo parcheggiato illegalmente (su ${violationTypeItalian}) presso il seguente indirizzo:

Indirizzo: ${report.address}
Data e ora della segnalazione: ${formattedDateTime}

In allegato una foto a dimostrazione della violazione.

Chiediamo gentilmente di intensificare i controlli in questa zona.

Per una visione completa delle aree problematiche, è possibile consultare la mappa disponibile nel nostro app: https://basta-malasosta-milano.lovable.app/

Cordiali saluti,

Basta Malasosta Milano

---

Non rispondere a questa mail, l'indirizzo del mittente non è monitorato. Per domande relative a questa segnalazione, si prega di contattare l'utente responsabile: ${report.userEmail} (in copia a questa mail).
  `;

  return { html, text };
};
