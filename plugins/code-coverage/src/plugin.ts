/*
 * Copyright 2021 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {
  configApiRef,
  createApiFactory,
  createPlugin,
  createRoutableExtension,
} from '@backstage/core';
import { codeCoverageApiRef, CodeCoverageRestApi } from './api';

import { rootRouteRef } from './routes';

export const codeCoveragePlugin = createPlugin({
  id: 'code-coverage',
  routes: {
    root: rootRouteRef,
  },
  apis: [
    createApiFactory({
      api: codeCoverageApiRef,
      deps: { configApi: configApiRef },
      factory: ({ configApi }) => CodeCoverageRestApi.fromConfig(configApi),
    }),
  ],
});

export const CodeCoveragePage = codeCoveragePlugin.provide(
  createRoutableExtension({
    component: () => import('./components/Router').then(m => m.Router),
    mountPoint: rootRouteRef,
  }),
);
