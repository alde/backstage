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
import { parseString } from 'xml2js';
import fs from 'fs';
import convert from './jacoco';
import { JacocoXML } from './types';
import { getVoidLogger } from '@backstage/backend-common';

/* eslint-disable no-restricted-syntax */

describe('convert jacoco', () => {
  let fixture: JacocoXML;
  parseString(
    fs.readFileSync(`${__dirname}/__fixtures__/jacoco-testdata-1.xml`),
    (_e, r) => {
      fixture = r;
    },
  );
  const expected = JSON.parse(
    fs
      .readFileSync(
        `${__dirname}/__fixtures__/jacoco-jsoncoverage-files-1.json`,
      )
      .toString(),
  );
  const scmFiles = fs
    .readFileSync(`${__dirname}/__fixtures__/jacoco-sourcefiles.txt`)
    .toString()
    .split('\n');

  it('converts a jacoco report', () => {
    const files = convert(fixture, scmFiles, getVoidLogger());

    expect(files.sort()).toEqual(expected.sort());
  });
});
