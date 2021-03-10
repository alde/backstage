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

import { useApi } from '@backstage/core-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { Progress, Table } from '@backstage/core';
import { Box, Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import { useAsync } from 'react-use';
import { codeCoverageApiRef } from '../../api';
import { Alert } from '@material-ui/lab';

type FileCoverage = {
  filename: string;
  branchHits: { [branch: number]: number };
  lineHits: { [line: number]: number };
};

export const FileExplorer = () => {
  const { entity } = useEntity();
  const codeCoverageApi = useApi(codeCoverageApiRef);
  const {
    loading: loadingCoverage,
    error: errorCoverage,
    value: valueCoverage,
  } = useAsync(
    async () =>
      await codeCoverageApi.getCoverageForEntity({
        kind: entity.kind,
        namespace: entity.metadata.namespace || 'default',
        name: entity.metadata.name,
      }),
  );

  if (loadingCoverage) {
    return <Progress />;
  } else if (errorCoverage) {
    return <Alert severity="error">{errorCoverage.message}</Alert>;
  }

  return (
    <Box mt={8}>
      <Card>
        <CardContent>
          <Box pl={2} mb={2} display="flex" justifyContent="space-between">
            <Typography variant="h5">Explore Files</Typography>
          </Box>
          <Table
            emptyContent={<>No files found</>}
            data={valueCoverage.files}
            columns={[
              {
                title: 'Path',
                field: 'filename',
              },
              {
                title: 'Coverage',
                type: 'numeric',
                render: (row: FileCoverage) => (
                  <>{`${Math.floor(
                    (Object.values(row.lineHits).filter(
                      (hits: number) => hits > 0,
                    ).length /
                      Object.values(row.lineHits).length) *
                      100,
                  )}%`}</>
                ),
              },
              {
                title: 'Missing lines',
                type: 'numeric',
                render: (row: FileCoverage) => (
                  <>
                    {Object.values(row.lineHits).filter(hits => !hits).length}
                  </>
                ),
              },
              {
                title: 'Tracked lines',
                type: 'numeric',
                render: (row: FileCoverage) => (
                  <>{Object.values(row.lineHits).length}</>
                ),
              },
            ]}
          />
        </CardContent>
      </Card>
    </Box>
  );
};
