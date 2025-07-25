import type { Mastery, Proficiency } from '~/shared';

export const masteryLevels = ['Novice', 'Advanced', 'Competent', 'Proficient', 'Expert'] as const satisfies Mastery[];

export const proficiencyLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Native'] as const satisfies Proficiency[];
