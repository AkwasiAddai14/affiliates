import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { kvkNummer } = req.query;

  if (!kvkNummer || typeof kvkNummer !== 'string') {
    return res.status(400).json({ error: 'Invalid KVK number' });
  }

  // Support both KVK_API_KEY (server-only) and NEXT_PUBLIC_KVK_API_KEY (legacy)
  const apiKey = (process.env.KVK_API_KEY ?? process.env.NEXT_PUBLIC_KVK_API_KEY)?.trim();
  if (!apiKey) {
    console.error('KVK API: KVK_API_KEY or NEXT_PUBLIC_KVK_API_KEY is not set in environment');
    return res.status(503).json({
      error: 'KVK lookup is not configured. Add KVK_API_KEY (or NEXT_PUBLIC_KVK_API_KEY) to .env or .env.local.',
    });
  }

  try {
    const searchUrl = `https://api.kvk.nl/api/v2/zoeken?kvkNummer=${kvkNummer}&pagina=1&resultatenPerPagina=1`;
    const profileUrl = `https://api.kvk.nl/api/v1/basisprofielen/${kvkNummer}`;

    console.log(`Requesting KVK data for number: ${kvkNummer}`);

    // First, search for the company (KVK expects apikey header)
    const searchResponse = await axios.get(searchUrl, {
      headers: {
        apikey: apiKey,
      },
    });

    console.log('Search Response:', searchResponse.data);

    if (searchResponse.data && searchResponse.data.resultaten && searchResponse.data.resultaten.length > 0) {
      // If the company is found, fetch the detailed profile
      const profileResponse = await axios.get(profileUrl, {
        headers: {
          apikey: apiKey,
        },
      });

      console.log('Profile Response:', profileResponse.data);

      if (profileResponse.data) {
        const companyData = profileResponse.data;
        const mainAddress = companyData._embedded.hoofdvestiging.adressen ? companyData._embedded.hoofdvestiging.adressen[0] : {};
        const companyName = companyData.naam || '';
        const streetName = mainAddress.straatnaam || '';
        const houseNumber = mainAddress.huisnummer || '';
        const houseNumberAddition = mainAddress.huisnummerToevoeging || '';
        const houseLetter = mainAddress.huisletter || '';
        const postalCode = mainAddress.postcode || '';
        const place = mainAddress.plaats || '';

        return res.status(200).json({
          companyName,
          streetName,
          houseNumber,
          houseNumberAddition,
          houseLetter,
          postalCode,
          place
        });
      } else {
        console.log('No detailed company data found for the provided KVK number.');
        return res.status(404).json({ error: 'No detailed company data found for the provided KVK number.' });
      }
    } else {
      console.log('No company data found for the provided KVK number.');
      return res.status(404).json({ error: 'No company data found for the provided KVK number.' });
    }
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = error.message;
      console.error('KVK API error:', status, message);
      if (status === 401) {
        return res.status(503).json({
          error: 'KVK API key is missing or invalid. Check KVK_API_KEY in .env.local and restart the dev server.',
        });
      }
      if (status === 404) {
        return res.status(404).json({ error: 'Geen gegevens gevonden voor dit KVK-nummer.' });
      }
      return res.status(status || 500).json({
        error: 'Kon KVK-gegevens niet ophalen.',
        details: message,
      });
    }
    console.error('KVK API error:', error);
    return res.status(500).json({
      error: 'Kon KVK-gegevens niet ophalen.',
      details: (error as Error).message,
    });
  }
}
