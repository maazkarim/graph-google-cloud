import { IntegrationStep } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig, IntegrationStepContext } from '../../../types';
import { CloudBuildClient } from '../client';
import { CloudBuildStepsSpec } from '../constants';
import { createGoogleCloudBuildGithubEnterpriseConfigEntity } from '../converters';

export const fetchCloudBuildGithubEnterpriseConfigStep: IntegrationStep<IntegrationConfig> =
  {
    ...CloudBuildStepsSpec.FETCH_BUILD_GITHUB_ENTERPRISE_CONFIG,
    executionHandler: async function (
      context: IntegrationStepContext,
    ): Promise<void> {
      const {
        jobState,
        instance: { config },
      } = context;
      const client = new CloudBuildClient({ config });

      await client.iterateBuildsGheConfigs(async (data) => {
        await jobState.addEntity(
          createGoogleCloudBuildGithubEnterpriseConfigEntity(data),
        );
      }, context);
    },
  };