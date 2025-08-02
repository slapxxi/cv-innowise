import type { Skill, SkillMastery } from '~/shared';

// todo: move and test
export function groupUserSkillsByParent(allSkills: Skill[], userSkills: SkillMastery[]): Record<string, Skill[]> {
  const userSkillNames = new Set(userSkills.map((s) => s.name));

  const normalizeCategory = (skill: Skill): string =>
    skill.categoryParentName || skill.category?.parent?.name || skill.categoryName || skill.category?.name || 'Unknown';

  return allSkills.reduce(
    (acc, skill) => {
      if (!userSkillNames.has(skill.name)) return acc;

      const key = normalizeCategory(skill);
      if (!acc[key]) acc[key] = [];

      acc[key].push(skill);
      return acc;
    },
    {} as Record<string, Skill[]>
  );
}
