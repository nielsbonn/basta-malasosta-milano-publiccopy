
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { VERSION } from "../../config/version";

const PrivacyLinks = () => {
  return (
    <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-600">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="text-gray-600 hover:text-gray-800">Informazioni Legali</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Informazioni Legali</DialogTitle>
          </DialogHeader>
          <div className="text-left">
            <p className="mb-4">Informazioni ai sensi del D.Lgs. 70/2003:</p>
            <p>Basta Malasosta Milano</p>
            <p>Iniziativa civica per il monitoraggio della sosta irregolare</p>
            <p>Email: milano@mobilita-sicura.eu</p>
            <p className="mt-4">Responsabile del contenuto:</p>
            <p>Basta Malasosta Milano Team</p>
            <p className="mt-4 text-sm text-gray-500">Versione: {VERSION}</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="link" className="text-gray-600 hover:text-gray-800 ml-4">Informativa sulla Privacy</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Informativa sulla Privacy</DialogTitle>
          </DialogHeader>
          <div className="text-left">
            <p className="mb-4">Ultimo aggiornamento: {new Date().toLocaleDateString()}</p>
            
            <h3 className="font-bold mt-4 mb-2">Fotografare targhe è legale (e utile per segnalare abusi)</h3>
            <p className="mb-2">È perfettamente legale fotografare la targa di un'auto altrui, se lo si fa in modo lecito e senza invadere proprietà private. Le foto possono essere inviate alle forze dell'ordine per segnalare comportamenti illeciti, come il parcheggio abusivo, ma non vanno diffuse pubblicamente per non violare la privacy.</p>
            <p className="mb-4">
              <a 
                href="https://www.facile.it/assicurazioni/news/si-puo-fotografare-la-targa-di-unauto.html" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-milano-blue font-medium flex items-center hover:underline"
              >
                Maggiori dettagli
                <svg className="ml-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </p>
            
            <h3 className="font-bold mt-4 mb-2">1. Dati che raccogliamo</h3>
            <p>Raccogliamo i seguenti dati personali:</p>
            <ul className="list-disc pl-5 mb-4">
              <li>Indirizzi email per scopi di verifica</li>
              <li>Dati di localizzazione anonimizzati delle segnalazioni</li>
            </ul>

            <h3 className="font-bold mt-4 mb-2">2. Come utilizziamo i tuoi dati</h3>
            <p>I tuoi dati vengono utilizzati per:</p>
            <ul className="list-disc pl-5 mb-4">
              <li>Verificare la tua identità durante l'invio delle segnalazioni</li>
              <li>Elaborare e inviare segnalazioni di violazioni</li>
            </ul>

            <h3 className="font-bold mt-4 mb-2">3. Conservazione dei dati</h3>
            <p>I tuoi dati sono conservati in modo sicuro sui server Supabase situati nell'UE.</p>

            <h3 className="font-bold mt-4 mb-2">4. I tuoi diritti</h3>
            <p>Ai sensi del GDPR, hai diritto a:</p>
            <ul className="list-disc pl-5 mb-4">
              <li>Accedere ai tuoi dati personali</li>
              <li>Rettificare i tuoi dati personali</li>
              <li>Richiedere la cancellazione dei tuoi dati personali</li>
              <li>Opporti al trattamento dei tuoi dati personali</li>
            </ul>

            <h3 className="font-bold mt-4 mb-2">5. Contatti</h3>
            <p>Per qualsiasi domanda relativa alla privacy, contattaci all'indirizzo: milano@mobilita-sicura.eu</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrivacyLinks;
