import React from 'react';
import type { CvProject } from '~/shared';

export function useSkillStats(projects: CvProject[]) {
  return React.useMemo(() => {
    const stats: Record<string, { years: number; last: number }> = {};
    projects.forEach(({ startDate, endDate, environment }) => {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : new Date();

      environment.forEach((env) => {
        const key = env.trim().toLowerCase();
        const entry = stats[key] ?? { years: 0, last: start.getFullYear() };
        entry.years = Math.max(entry.years, new Date().getFullYear() - start.getFullYear());
        entry.last = Math.max(entry.last, end.getFullYear());
        stats[key] = entry;
      });
    });

    const getYears = (name: string) => stats[name.toLowerCase()]?.years ?? null;
    const getLastUsed = (name: string) => stats[name.toLowerCase()]?.last ?? null;
    return {
      years: getYears,
      lastUsed: getLastUsed,
    };
  }, [projects]);
}
