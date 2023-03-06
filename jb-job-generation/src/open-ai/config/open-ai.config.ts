import { registerAs } from '@nestjs/config';
import { getEnvWithProdGuard } from '../../env/utils/check-production-env.util';

export const OPENAI_CONFIG_KEY = 'openai-config';

export default registerAs(OPENAI_CONFIG_KEY, () => ({
  orgID: getEnvWithProdGuard('OPENAI_ORG_ID'),
  apiKey: getEnvWithProdGuard('OPENAI_API_KEY'),
}));
