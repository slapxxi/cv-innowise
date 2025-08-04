import { useQueryClient, useSuspenseQuery, type UseSuspenseQueryOptions } from '@tanstack/react-query';
import fuzzysort from 'fuzzysort';
import { useMemo } from 'react';
import { useAuth } from '~/features';
import { createComparator, getProjects, type GetProjectsData, type GetProjectsError, type SortOrder } from '~/shared';

type QueryOptions = UseSuspenseQueryOptions<GetProjectsData, GetProjectsError>;

export const projectsSortingFields = ['name', 'description', 'internalName', 'domain', 'startDate', 'endDate'] as const;

const queryKey = ['projects'];

export const projectsOptions = (params: { accessToken: string }) => {
  const { accessToken } = params;
  return {
    queryKey,
    queryFn: async () => {
      const projectsResult = await getProjects({ accessToken });

      if (projectsResult.ok) {
        return projectsResult.data;
      }

      throw projectsResult.error;
    },
  };
};

export type ProjectsSortKey = (typeof projectsSortingFields)[number];

type ProjectsSearchParams = Partial<{
  q: string;
  sort: ProjectsSortKey;
  order: SortOrder;
}>;

type Params = {} & ProjectsSearchParams & Omit<QueryOptions, 'queryKey' | 'queryFn'>;

export function useProjects(params: Params = {}) {
  const queryClient = useQueryClient();
  const { sort = 'name', q = '', order = 'asc', ...restParams } = params ?? {};
  const auth = useAuth();
  const { data: projects, ...rest } = useSuspenseQuery({
    ...projectsOptions({ accessToken: auth.accessToken! }),
    ...restParams,
  });

  const searchedProjects = useMemo(() => {
    const searchResults = fuzzysort.go(q, projects, {
      all: true,
      threshold: 0,
      keys: projectsSortingFields,
    });

    const searchedProjects = searchResults.map((result) => {
      const [name, description, internalName, domain, startDate, endDate] = result;

      return {
        ...result.obj,
        highlights: {
          name: name.highlight(),
          description: description.highlight(),
          internalName: internalName.highlight(),
          domain: domain.highlight(),
          startDate: startDate.highlight(),
          endDate: endDate.highlight(),
        },
      };
    });

    return searchedProjects;
  }, [q, projects]);

  const sortedProjects = useMemo(() => {
    return [...searchedProjects].sort(createComparator(sort, order, (project, key) => project[key]));
  }, [searchedProjects, sort, order]);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey });
  }

  return {
    projects: sortedProjects,
    total: sortedProjects.length,
    invalidateProjects: invalidate,
    ...rest,
  };
}
