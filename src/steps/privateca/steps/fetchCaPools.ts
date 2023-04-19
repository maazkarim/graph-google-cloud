import {
  GoogleCloudIntegrationStep,
  IntegrationStepContext,
} from '../../../types';
import { PrivateCaClient } from '../client';
import { PrivatecaEntities, PrivatecaSteps } from '../constants';
import { createCaPoolEntity } from '../converters';

export async function fetchCaPools(
  context: IntegrationStepContext,
): Promise<void> {
  const {
    jobState,
    instance: { config },
    logger,
  } = context;

  const client = new PrivateCaClient({ config });

  await client.iterateCaPools(async (caPool) => {
    if (!caPool) {
      logger.warn(
        `${PrivatecaSteps.STEP_PRIVATE_CA_POOLS.id} - Found undefined caPool entity in iterateCaPools.`,
      );

      return;
    }
    await jobState.addEntity(createCaPoolEntity(caPool));
  });
}

export const fetchCaPoolsStepMap: GoogleCloudIntegrationStep = {
  id: PrivatecaSteps.STEP_PRIVATE_CA_POOLS.id,
  name: PrivatecaSteps.STEP_PRIVATE_CA_POOLS.name,
  entities: [PrivatecaEntities.PRIVATE_CA_POOL],
  relationships: [],
  dependsOn: [],
  executionHandler: fetchCaPools,
  permissions: [],
  apis: ['privateca.googleapis.com'],
};
