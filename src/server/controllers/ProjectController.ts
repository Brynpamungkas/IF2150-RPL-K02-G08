import { buatAksi } from './AksiController';

/** C22, UC03: tahap informasi menghasilkan ID, tahap lengkap melengkapi kebutuhan. */
export const buatProject = (request: Request) => buatAksi(request, 'project');
