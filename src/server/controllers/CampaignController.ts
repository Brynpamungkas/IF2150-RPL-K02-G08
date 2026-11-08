import { buatAksi } from './AksiController';

/** C19, UC02. */
export const buatCampaign = (request: Request) => buatAksi(request, 'campaign');
