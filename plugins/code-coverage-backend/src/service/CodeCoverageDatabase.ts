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
import { NotFoundError, resolvePackagePath } from '@backstage/backend-common';
import { EntityName } from '@backstage/catalog-model';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import { Logger } from 'winston';
import { aggregateCoverage } from './CoverageUtils';
import { JsonCodeCoverage, JsonCoverageHistory } from './jsoncoverage-types';

export type RawDbCoverageRow = {
  id: string;
  entity_name: string;
  entity_namespace: string;
  entity_kind: string;
  coverage: string;
};
export interface CodeCoverageStore {
  insertCodeCoverage(
    coverage: JsonCodeCoverage,
  ): Promise<{ codeCoverageId: string }>;
  getCodeCoverage(entity: EntityName): Promise<JsonCodeCoverage>;
  getHistory(entity: EntityName, limit: number): Promise<JsonCoverageHistory>;
}

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-code-coverage-backend',
  'migrations',
);
export class CodeCoverageDatabase implements CodeCoverageStore {
  static async create(knex: Knex, logger: Logger): Promise<CodeCoverageStore> {
    await knex.migrate.latest({
      directory: migrationsDir,
    });
    return new CodeCoverageDatabase(knex, logger);
  }

  constructor(private readonly db: Knex, private readonly logger: Logger) {}

  async insertCodeCoverage(
    coverage: JsonCodeCoverage,
  ): Promise<{ codeCoverageId: string }> {
    const codeCoverageId = uuid();
    await this.db<RawDbCoverageRow>('code_coverage').insert({
      id: codeCoverageId,
      entity_name: coverage.entity.name,
      entity_kind: coverage.entity.kind,
      entity_namespace: coverage.entity.namespace,
      coverage: JSON.stringify(coverage),
    });
    return { codeCoverageId };
  }
  async getCodeCoverage(entity: EntityName): Promise<JsonCodeCoverage> {
    const [result] = await this.db<RawDbCoverageRow>('code_coverage')
      .where({
        entity_name: entity.name,
        entity_kind: entity.kind,
        entity_namespace: entity.namespace,
      })
      .limit(1)
      .select();
    if (!result) {
      throw new NotFoundError(
        `No coverage for entity '${JSON.stringify(entity)}' found`,
      );
    }
    try {
      return JSON.parse(result.coverage);
    } catch (error) {
      throw new Error(`Failed to parse coverage for '${entity}', ${error}`);
    }
  }

  async getHistory(
    entity: EntityName,
    limit: number,
  ): Promise<JsonCoverageHistory> {
    const res = await this.db<RawDbCoverageRow>('code_coverage')
      .where({
        entity_name: entity.name,
        entity_kind: entity.kind,
        entity_namespace: entity.namespace,
      })
      .limit(limit)
      .select();

    const history = res
      .map(r => JSON.parse(r.coverage))
      .map(c => aggregateCoverage(c));

    return {
      entity,
      history: history,
    };
  }
}
