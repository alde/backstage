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
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import xmlparser from 'express-xml-bodyparser';
import { Config } from '@backstage/config';

export interface RouterOptions {
  config: Config;
  discovery: PluginEndpointDiscovery;
  logger: Logger;
}

export interface CodeCoverageApi {
  name: string;
  // api: CodeCoverageApi;
}

const validateRequestBody = (req: Request) => {
  // const contentType = req.header('content-type');
  // if (!contentType) {
  //   // throw new InputError('Content-Type missing');
  // } else if (!contentType.match(/^text\/xml($|;)/)) {
  //   // throw new InputError('Illegal Content-Type');
  // }
  const body = req.body;
  if (!body) {
    // throw new InputError('Missing request body');
  }
  return body;
};

export const makeRouter = async (
  options: RouterOptions,
): Promise<express.Router> => {
  const { logger, discovery, config } = options;

  const appUrl = config.getString('app.baseUrl');
  const codecovUrl = await discovery.getExternalBaseUrl('code-coverage');
  const catalogApi = new CatalogClient({ discoveryApi: discovery });

  const router = Router();
  router.use(express.json());

  router.post('/cobertura/:kind/:namespace/:name/', async (req, res) => {
    const { kind, namespace, name } = req.params;
    const entities = catalogApi.getEntityByName({ kind, namespace, name });
    const body = validateRequestBody(req);
    logger.info(body);
    // const json = await jsonCoverage.parse(body);
    res.status(200).json(body);
  });

  router.use(xmlparser());
  // router.use(errorHandler());
  return router;
};

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const logger = options.logger;

  logger.info('Initializing Code Coverage backend');

  return makeRouter(options);
}
