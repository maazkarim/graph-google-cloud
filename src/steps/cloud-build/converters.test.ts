import { createBuildEntity } from './converters';

const buildMock = {
  id: '58991a72-f158-481d-ad66-771b90ce3e65',
  status: 'FAILURE',
  source: {
    storageSource: {
      bucket: 'j1-gc-integration-dev-v3_cloudbuild',
      object: 'source/1660769074.865182-d160c8803b704c60b50e68d2b3b97d73.tgz',
      generation: '1660769077096260',
    },
  },
  createTime: '2022-08-17T20:44:37.573002899Z',
  startTime: '2022-08-17T20:44:38.421413511Z',
  finishTime: '2022-08-17T20:44:46.243182675Z',
  results: {
    buildStepImages: [
      'sha256:0229d2fde1be1a278c6bb73fbfd98b2df63c30cb9012c882bdfa228e738afdf5',
      '',
      '',
      '',
      '',
    ],
    buildStepOutputs: ['', '', '', '', ''],
  },
  steps: [
    {
      name: 'gcr.io/cloud-builders/gsutil',
      args: [
        '-c',
        "gsutil ls -b gs://<some bucket for caching gradle file> || gsutil mb -l gs://<some bucket for caching gradle file>\n\n(\n  gsutil cp gs://<some bucket for caching gradle file>/<file to hold cached content>.tar.gz /tmp/gradle-cache.tar.gz &&\n  tar -xzf /tmp/gradle-cache.tar.gz\n) || echo 'Cache not found'\n",
      ],
      dir: '/cachinghome',
      waitFor: ['-'],
      entrypoint: 'bash',
      volumes: [
        {
          name: 'caching.home',
          path: '/cachinghome',
        },
      ],
      timing: {
        startTime: '2022-08-17T20:44:45.021642025Z',
        endTime: '2022-08-17T20:44:45.676265144Z',
      },
      status: 'FAILURE',
      pullTiming: {
        startTime: '2022-08-17T20:44:45.021642025Z',
        endTime: '2022-08-17T20:44:45.023016172Z',
      },
    },
    {
      name: 'openjdk:11',
      args: [
        '-c',
        'set -x\nexport CACHING_HOME="/cachinghome"\nUSER_HOME="/root"\nM2_HOME="${USER_HOME}/.m2"\nM2_CACHE="${CACHING_HOME}/maven"\nGRADLE_HOME="${USER_HOME}/.gradle"\nGRADLE_CACHE="${CACHING_HOME}/gradle"\n\necho "Generating symbolic links for caches"\nmkdir -p ${M2_CACHE}\nmkdir -p ${GRADLE_CACHE}\n\n[[ -d "${M2_CACHE}" && ! -d "${M2_HOME}" ]] && ln -s "${M2_CACHE}" "${M2_HOME}"\n[[ -d "${GRADLE_CACHE}" && ! -d "${GRADLE_HOME}" ]] && ln -s "${GRADLE_CACHE}" "${GRADLE_HOME}"\n./gradlew check',
      ],
      id: 'test',
      entrypoint: '/bin/bash',
      volumes: [
        {
          name: 'caching.home',
          path: '/cachinghome',
        },
      ],
      status: 'QUEUED',
    },
    {
      name: 'openjdk:11',
      args: [
        '-c',
        'set -x\nexport CACHING_HOME="/cachinghome"\nUSER_HOME="/root"\nM2_HOME="${USER_HOME}/.m2"\nM2_CACHE="${CACHING_HOME}/maven"\nGRADLE_HOME="${USER_HOME}/.gradle"\nGRADLE_CACHE="${CACHING_HOME}/gradle"\n\necho "Generating symbolic links for caches"\nmkdir -p ${M2_CACHE}\nmkdir -p ${GRADLE_CACHE}\n\n[[ -d "${M2_CACHE}" && ! -d "${M2_HOME}" ]] && ln -s "${M2_CACHE}" "${M2_HOME}"\n[[ -d "${GRADLE_CACHE}" && ! -d "${GRADLE_HOME}" ]] && ln -s "${GRADLE_CACHE}" "${GRADLE_HOME}"\n./gradlew jib --image=gcr.io/j1-gc-integration-dev-v3/hello-cloud-build:',
      ],
      id: 'build-image',
      entrypoint: '/bin/bash',
      volumes: [
        {
          name: 'caching.home',
          path: '/cachinghome',
        },
      ],
      status: 'QUEUED',
    },
    {
      name: 'gcr.io/cloud-builders/gcloud',
      args: [
        'run',
        'deploy',
        '--image=gcr.io/j1-gc-integration-dev-v3/hello-cloud-build:',
        '--platform=managed',
        '--project=j1-gc-integration-dev-v3',
        '--region=us-central1',
        '--allow-unauthenticated',
        '--memory=256Mi',
        '--set-env-vars=SPRING_PROFILES_ACTIVE=gcp',
        'hello-cloud-build',
      ],
      id: 'deploy',
      volumes: [
        {
          name: 'caching.home',
          path: '/cachinghome',
        },
      ],
      status: 'QUEUED',
    },
    {
      name: 'gcr.io/cloud-builders/gsutil',
      args: [
        '-c',
        'tar -czf /tmp/gradle-cache.tar.gz gradle/ &&\ngsutil cp /tmp/gradle-cache.tar.gz gs://<some bucket for caching gradle file>/<file to hold cached content>.tar.gz\n',
      ],
      dir: '/cachinghome',
      waitFor: ['deploy'],
      entrypoint: 'bash',
      volumes: [
        {
          name: 'caching.home',
          path: '/cachinghome',
        },
      ],
      status: 'QUEUED',
    },
  ],
  timeout: '600s',
  projectId: 'j1-gc-integration-dev-v3',
  logsBucket: 'gs://167984947943.cloudbuild-logs.googleusercontent.com',
  sourceProvenance: {
    resolvedStorageSource: {
      bucket: 'j1-gc-integration-dev-v3_cloudbuild',
      object: 'source/1660769074.865182-d160c8803b704c60b50e68d2b3b97d73.tgz',
      generation: '1660769077096260',
    },
    fileHashes: {
      'gs://j1-gc-integration-dev-v3_cloudbuild/source/1660769074.865182-d160c8803b704c60b50e68d2b3b97d73.tgz#1660769077096260':
        {
          fileHash: [
            {
              type: 'MD5',
              value: 'eg9jmTQDqknuC0oat864jA==',
            },
          ],
        },
    },
  },
  options: {
    logging: 'LEGACY',
    pool: {},
  },
  logUrl:
    'https://console.cloud.google.com/cloud-build/builds/58991a72-f158-481d-ad66-771b90ce3e65?project=167984947943',
  substitutions: {
    _GCS_CACHE_BUCKET: '<some bucket for caching gradle file>',
    _GCS_CACHE_FILE: '<file to hold cached content>',
  },
  timing: {
    BUILD: {
      startTime: '2022-08-17T20:44:44.385497769Z',
      endTime: '2022-08-17T20:44:45.676362304Z',
    },
    FETCHSOURCE: {
      startTime: '2022-08-17T20:44:38.927319156Z',
      endTime: '2022-08-17T20:44:44.385391800Z',
    },
  },
  queueTtl: '3600s',
  name: 'projects/167984947943/locations/global/builds/58991a72-f158-481d-ad66-771b90ce3e65',
  failureInfo: {
    type: 'USER_BUILD_STEP',
    detail:
      'Build step failure: build step 0 "gcr.io/cloud-builders/gsutil" failed: step exited with non-zero status: 1',
  },
};

describe('#createBuildEntity', () => {
  test('should convert to entity', () => {
    expect(createBuildEntity(buildMock)).toMatchSnapshot();
  });
});
