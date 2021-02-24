/*
 * Copyright 2020 Spotify AB
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

import { createApiRef } from '@backstage/core';
import { Config } from '@backstage/config';
import { EntityName } from '@backstage/catalog-model';

export class FetchError extends Error {
  get name(): string {
    return this.constructor.name;
  }

  static async forResponse(resp: Response): Promise<FetchError> {
    return new FetchError(
      `Request failed with status code ${
        resp.status
      }.\nReason: ${await resp.text()}`,
    );
  }
}

export type CodeCoverageApi = {
  url: string;
  getCoverageForEntity: (entity: EntityName) => Promise<any>;
};

export const codeCoverageApiRef = createApiRef<CodeCoverageApi>({
  id: 'plugin.code-coverage.service',
  description: 'Used by the code coverage plugin to make requests',
});

export class CodeCoverageRestApi implements CodeCoverageApi {
  static fromConfig(config: Config) {
    return new CodeCoverageRestApi(config.getString('backend.baseUrl'));
  }

  constructor(public url: string) {}

  private async fetch<T = any>(input: string, init?: RequestInit): Promise<T> {
    const resp = await fetch(`${this.url}${input}`, init);
    if (!resp.ok) throw await FetchError.forResponse(resp);
    return await resp.json();
  }

  async getCoverageForEntity({
    kind,
    namespace,
    name,
  }: EntityName): Promise<any> {
    return await this.fetch<any>(
      `/api/code-coverage/${kind}/${namespace}/${name}`,
    );
  }
}
