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
import { AggregateCoverage, JsonCodeCoverage } from './jsoncoverage-types';

const calculatePercentage = (available: number, covered: number): number => {
  if (available === 0) {
    return 0;
  }
  return parseFloat(((covered / available) * 100).toFixed(2));
};

export const aggregateCoverage = (c: JsonCodeCoverage): AggregateCoverage => {
  let availableLine = 0;
  let coveredLine = 0;
  let availableBranch = 0;
  let coveredBranch = 0;
  c.files.forEach(f => {
    availableLine += Object.keys(f.lineHits).length;
    coveredLine += Object.values(f.lineHits).filter(l => l > 0).length;

    availableBranch = Object.keys(f.branchHits)
      .map(b => parseInt(b, 10))
      .map((b: number) => f.branchHits[b].available)
      .filter(Boolean)
      .reduce((acc, curr) => acc + curr, 0);
    coveredBranch = Object.keys(f.branchHits)
      .map(b => parseInt(b, 10))
      .map((b: number) => f.branchHits[b].covered)
      .filter(Boolean)
      .reduce((acc, curr) => acc + curr, 0);
  });

  return {
    timestamp: c.metadata.generationTime,
    branch: {
      available: availableBranch,
      covered: coveredBranch,
      missed: availableBranch - coveredBranch,
      percentage: calculatePercentage(availableBranch, coveredBranch),
    },
    line: {
      available: availableLine,
      covered: coveredLine,
      missed: availableLine - coveredLine,
      percentage: calculatePercentage(availableLine, coveredLine),
    },
  };
};
