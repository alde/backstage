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
import React from 'react';
import { useAsync } from 'react-use';
import { Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Page, Progress, useApi } from '@backstage/core';
import { codeCoverageApiRef } from '../../api';

export const CodeCoveragePage = () => {
  const { entity } = useEntity();
  const codeCoverageApi = useApi(codeCoverageApiRef);
  const { loading, error, value } = useAsync(
    async () =>
      await codeCoverageApi.getCoverageForEntity({
        kind: entity.kind,
        namespace: entity.metadata.namespace || 'default',
        name: entity.metadata.name,
      }),
  );

  let content;
  if (loading) {
    content = <Progress />;
  } else if (error) {
    content = <Alert severity="error">{error.message}</Alert>;
  } else if (value) {
    content = <pre>{JSON.stringify(value, null, 2)}</pre>;
  }

  return (
    <Page themeId="tool">
      <Grid container spacing={3} direction="column">
        <Grid item>{content}</Grid>
      </Grid>
    </Page>
  );
};
