import { type UseSuspenseQueryOptions } from '@tanstack/react-query';
import fuzzysort from 'fuzzysort';
import { useMemo } from 'react';
import { createComparator, type GetCvData, type GetCvError, type SortOrder } from '~/shared';
import { cvOptions, useCv } from './use-cv.service';

export const cvProjectsSortingFields = [
  'name',
  'internalName',
  'domain',
  'startDate',
  'endDate',
  'description',
] as const;

export type CvProjectsSortKey = (typeof cvProjectsSortingFields)[number];

export const cvProjectsOptions = cvOptions;

type CvProjectsSearchParams = Partial<{
  q: string;
  sort: CvProjectsSortKey;
  order: SortOrder;
}>;

type QueryOptions = UseSuspenseQueryOptions<GetCvData, GetCvError>;

type Params = { id: string } & CvProjectsSearchParams & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export function useCvProjects(params: Params) {
  const { id, sort = 'name', q = '', order = 'asc', ...restParams } = params;
  const { cv, invalidateCv, ...rest } = useCv({ id, ...restParams });

  const searchedCvProjects = useMemo(() => {
    const searchResults = fuzzysort.go(q, cv.projects ?? [], {
      all: true,
      threshold: 0,
      keys: cvProjectsSortingFields,
    });

    const searchedCvs = searchResults.map((result) => {
      const [name, internalName, domain, startDate, endDate, description] = result;

      return {
        ...result.obj,
        highlights: {
          name: name.highlight(),
          internalName: internalName.highlight(),
          domain: domain.highlight(),
          startDate: startDate.highlight(),
          endDate: endDate.highlight(),
          description: description.highlight(),
        },
      };
    });

    return searchedCvs;
  }, [q, cv]);

  const sortedCvProjects = useMemo(() => {
    return [...searchedCvProjects].sort(createComparator(sort, order, (project, key) => project[key]));
  }, [searchedCvProjects, sort, order]);

  return {
    cvProjects: sortedCvProjects,
    total: sortedCvProjects.length,
    invalidateCvProjects: invalidateCv,
    ...rest,
  };
}
