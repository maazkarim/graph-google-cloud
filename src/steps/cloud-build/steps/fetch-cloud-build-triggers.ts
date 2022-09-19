import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../types';
import { CloudBuildClient } from '../client';
import { CloudBuildStepsSpec } from '../constants';
import { createGoogleCloudBuildTriggerEntity } from '../converters';

export const fetchCloudBuildTriggerStep: IntegrationStep<IntegrationConfig> = {
  ...CloudBuildStepsSpec.FETCH_BUILD_TRIGGERS,
  executionHandler: async function (
    context: IntegrationStepContext,
  ): Promise<void> {
    const {
      jobState,
      instance: { config },
    } = context;
    const client = new CloudBuildClient({ config });

    await client.iterateBuildTriggers(async (data) => {
      await jobState.addEntity(createGoogleCloudBuildTriggerEntity(data));
    });
  },
};