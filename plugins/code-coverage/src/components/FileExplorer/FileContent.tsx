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

import React, { useEffect } from 'react';
import { useApi } from '@backstage/core-api';
import { useEntity } from '@backstage/plugin-catalog-react';
import { useAsync } from 'react-use';
import { codeCoverageApiRef } from '../../api';
import { Progress } from '@backstage/core';
import { Alert } from '@material-ui/lab';

type Props = {
  filename: string;
};

async function blobToBase64(blob: Blob | File): Promise<string> {
  const reader = new FileReader();
  const readerPromise = new Promise((resolve, reject) => {
    reader.onload = () => resolve('');
    reader.onerror = error => reject(error);
    reader.onabort = () => reject(new Error('file reader was aborted'));
  });

  reader.readAsDataURL(blob);
  await readerPromise;

  const dataUri = reader.result as string;
  const base64Data = dataUri.replace(/data:[^;]+;base64,/, '');
  return base64Data;
}

const getContent = async (value: any) => {
  let blob = value;
  if (value instanceof ArrayBuffer || ArrayBuffer.isView(value)) {
    blob = new Blob([value], { type: 'application/octet-stream' });
  }
  return value;
};

export const FileContent = ({ filename }: Props) => {
  const { entity } = useEntity();
  const codeCoverageApi = useApi(codeCoverageApiRef);
  const { loading, error, value } = useAsync(
    async () =>
      await codeCoverageApi.getFileContentFromEntity(
        {
          kind: entity.kind,
          namespace: entity.metadata.namespace || 'default',
          name: entity.metadata.name,
        },
        filename,
      ),
  );

  useEffect(() => {
    if (value) getContent(value);
  }, [value]);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <Alert severity="error">{error.message}</Alert>;
  }

  return (
    <div>
      {filename}
      <div>
        <pre>{value}</pre>
      </div>
    </div>
  );
};
