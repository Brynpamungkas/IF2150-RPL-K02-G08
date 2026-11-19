import { defineConfig } from 'vitest/config';
import config from './vitest.config';

export default defineConfig({
  resolve: config.resolve,
  test: {
    environment: 'node',
    include: ['tests/aksi.m10-*.spec.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'shared/validasiAksi.ts',
        'server/services/AksiService.ts',
        'server/repositories/AksiRepository.ts',
        'server/controllers/AksiController.ts',
        'server/controllers/CampaignController.ts',
        'server/controllers/ProjectController.ts',
        'server/controllers/VerifikasiController.ts',
      ],
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage/aksi',
      thresholds: {
        perFile: true,
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
});
