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

import express, { Request } from 'express';

import Router from 'express-promise-router';
import { Logger } from 'winston';
import { CatalogClient } from '@backstage/catalog-client';
import {
  errorHandler,
  InputError,
  NotFoundError,
  PluginDatabaseManager,
  PluginEndpointDiscovery,
  UrlReader,
} from '@backstage/backend-common';
import { Config } from '@backstage/config';
import { ScmIntegration, ScmIntegrations } from '@backstage/integration';
import xmlparser from 'express-xml-bodyparser';
import { cobertura, jacoco } from './converter';
import { CodeCoverageDatabase } from './CodeCoverageDatabase';
import { Entity } from '@backstage/catalog-model';
import { CoberturaXML } from './converter/types';
import { FileEntry, JsonCodeCoverage } from './jsoncoverage-types';

export interface RouterOptions {
  config: Config;
  discovery: PluginEndpointDiscovery;
  database: PluginDatabaseManager;
  urlReader: UrlReader;
  logger: Logger;
}

export interface CodeCoverageApi {
  name: string;
}

const validateRequestBody = (req: Request) => {
  const contentType = req.header('content-type');
  if (!contentType) {
    throw new InputError('Content-Type missing');
  } else if (!contentType.match(/^text\/xml($|;)/)) {
    throw new InputError('Illegal Content-Type');
  }
  const body = req.body;
  if (!body) {
    throw new InputError('Missing request body');
  }
  return body;
};

export const makeRouter = async (
  options: RouterOptions,
): Promise<express.Router> => {
  const { config, logger, discovery, database, urlReader } = options;

  const codeCoverageDatabase = await CodeCoverageDatabase.create(
    await database.getClient(),
  );
  const codecovUrl = await discovery.getExternalBaseUrl('code-coverage');
  const catalogApi = new CatalogClient({ discoveryApi: discovery });
  const scm = ScmIntegrations.fromConfig(config);

  const router = Router();
  router.use(xmlparser());
  router.use(express.json());

  const processCoveragePayload = async (
    entity: Entity,
    req: Request,
  ): Promise<{
    sourceLocation?: string;
    vcs?: ScmIntegration;
    scmFiles: string[];
    body: {};
  }> => {
    const enforceScmFiles =
      entity.metadata.annotations?.['backstage.io/code-coverage-scm-only'] ||
      false;

    let sourceLocation: string | undefined = undefined;
    let vcs: ScmIntegration | undefined = undefined;
    let scmFiles: string[] = [];

    if (enforceScmFiles) {
      sourceLocation =
        entity.metadata.annotations?.['backstage.io/source-location'];
      if (!sourceLocation) {
        throw new InputError(
          `No "backstage.io/source-location" annotation on entity ${entity.kind}/${entity.metadata.namespace}/${entity.metadata.name}`,
        );
      }

      vcs = scm.byUrl(sourceLocation);
      if (!vcs) {
        throw new InputError(`Unable to determine SCM from ${sourceLocation}`);
      }

      const scmTree = await urlReader.readTree(sourceLocation);
      scmFiles = (await scmTree.files()).map(f => f.path);
    }

    const body = validateRequestBody(req);

    return {
      sourceLocation,
      vcs,
      scmFiles,
      body,
    };
  };

  const buildCoverage = async (
    entity: Entity,
    sourceLocation: string | undefined,
    vcs: ScmIntegration | undefined,
    files: FileEntry[],
  ): Promise<JsonCodeCoverage> => {
    return {
      metadata: {
        vcs: {
          type: vcs?.type || 'unknown',
          location: sourceLocation || 'unknown',
        },
        generationTime: Date.now(),
      },
      entity: {
        name: entity.metadata.name,
        namespace: entity.metadata.namespace || 'default',
        kind: entity.kind,
      },
      files,
    };
  };

  router.get('/health', async (req, res) => {
    res.status(200).json({ status: 'ok' });
  });
  router.get('/:kind/:namespace/:name', async (req, res) => {
    const { kind, namespace, name } = req.params;
    const entity = await catalogApi.getEntityByName({ kind, namespace, name });
    if (!entity) {
      throw new NotFoundError(
        `No entity found matching ${kind}/${namespace}/${name}`,
      );
    }
    const stored = await codeCoverageDatabase.getCodeCoverage({
      kind,
      namespace,
      name,
    });

    res.status(200).json(stored);
  });

  router.post('/cobertura/:kind/:namespace/:name/', async (req, res) => {
    const { kind, namespace, name } = req.params;
    const entity = await catalogApi.getEntityByName({ kind, namespace, name });
    if (!entity) {
      throw new NotFoundError(
        `No entity found matching ${kind}/${namespace}/${name}`,
      );
    }

    const {
      sourceLocation,
      vcs,
      scmFiles,
      body,
    } = await processCoveragePayload(entity, req);

    const files = await cobertura(body as CoberturaXML, scmFiles, logger);
    if (!files || files.length === 0) {
      throw new InputError('Unable to parse body as Cobertura XML');
    }

    const coverage = await buildCoverage(entity, sourceLocation, vcs, files);

    await codeCoverageDatabase.insertCodeCoverage(coverage);

    res.status(201).json({
      links: [
        {
          rel: 'coverage',
          href: `${codecovUrl}/${kind}/${namespace}/${name}`,
        },
      ],
    });
  });

  router.post('/jacoco/:kind/:namespace/:name/', async (req, res) => {
    const { kind, namespace, name } = req.params;
    const entity = await catalogApi.getEntityByName({ kind, namespace, name });
    if (!entity) {
      throw new NotFoundError(
        `No entity found matching ${kind}/${namespace}/${name}`,
      );
    }
    const {
      sourceLocation,
      vcs,
      scmFiles,
      body,
    } = await processCoveragePayload(entity, req);

    const files = await jacoco(body, scmFiles, logger);
    if (!files || files.length === 0) {
      throw new InputError('Unable to parse body as Jacoco XML');
    }

    const coverage = await buildCoverage(entity, sourceLocation, vcs, files);

    await codeCoverageDatabase.insertCodeCoverage(coverage);

    res.status(201).json({
      links: [
        {
          rel: 'coverage',
          href: `${codecovUrl}/${kind}/${namespace}/${name}`,
        },
      ],
    });
  });

  router.use(errorHandler());
  return router;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const logger = options.logger;

  logger.info('Initializing Code Coverage backend');

  return makeRouter(options);
}
