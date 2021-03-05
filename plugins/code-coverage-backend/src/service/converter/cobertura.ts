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
import { BranchHit, FileEntry } from '../jsoncoverage-types';
import { CoberturaXML, InnerClass, LineHit } from './types';
import { Logger } from 'winston';

/**
 * Extract line hits from a class coverage entry
 *
 * @param clz class coverage information
 */
const extractLines = (clz: InnerClass): Array<LineHit> => {
  const lines = clz.lines.flatMap(l => l.line);
  const lineHits = lines.map(l => {
    return {
      number: parseInt((l.$.number as unknown) as string, 10),
      hits: parseInt((l.$.hits as unknown) as string, 10),
      'condition-coverage': l.$['condition-coverage'],
      branch: l.$.branch,
    };
  });
  return lineHits;
};

/**
 * Parses branch coverage information from condition-coverage
 *
 * @param condition condition-coverage value from line coverage
 */
const parseBranch = (condition: string): BranchHit | null => {
  const pattern = /[0-9\.]+\%\s\(([0-9]+)\/([0-9]+)\)/;
  const match = condition.match(pattern);
  if (!match) {
    return null;
  }
  const covered = parseInt(match[0], 10);
  const available = parseInt(match[1], 10);
  return {
    covered: covered,
    missed: available - covered,
    available: available,
  };
};

/**
 * Converts cobertura into shared json coverage format
 *
 * @param xml cobertura xml object
 * @param scmFiles list of files that are commited to SCM
 */
const convert = (
  xml: CoberturaXML,
  scmFiles: Array<string>,
  logger: Logger,
): Array<FileEntry> => {
  const packages = xml.coverage.packages.flatMap(ps => {
    return ps.package;
  });

  const jscov: Array<FileEntry> = [];
  packages.forEach(p => {
    const classes = p.classes.flatMap(cs => cs.class);

    classes.forEach(c => {
      const packageAndFilename = c.$.filename;
      const lines = extractLines(c);
      const lineHits: Record<number, number> = {};
      const branchHits: Record<number, BranchHit> = {};

      lines.forEach(l => {
        if (!lineHits[l.number]) {
          lineHits[l.number] = 0;
        }
        lineHits[l.number] += l.hits;
        if (l.branch && l['condition-coverage']) {
          const bh = parseBranch(l['condition-coverage']);
          if (bh) {
            branchHits[l.number] = bh;
          }
        }
      });

      const currentFile = scmFiles.find(f => f.endsWith(packageAndFilename));
      logger.info(`matched ${packageAndFilename} to ${currentFile}`);
      if (Object.keys(lineHits).length > 0 && currentFile) {
        jscov.unshift({
          filename: currentFile,
          branchHits: branchHits,
          lineHits: lineHits,
        });
      }
    });
  });

  return jscov;
};

/**
 * Converts cobertura coverage into a standardized json coverage format.
 *
 * @param xml cobertura xml document
 */
const cobertura = async (
  xml: CoberturaXML,
  scmFiles: Array<string>,
  logger: Logger,
): Promise<Array<FileEntry>> => {
  return convert(xml, scmFiles, logger);
};

export default cobertura;
