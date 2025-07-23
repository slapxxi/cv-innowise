import { cn, type Mastery, type MasteryLevel } from '~/shared';

type MasteryMap<T> = {
  [key in MasteryLevel]: T;
};

type Color = {
  light: string;
  normal: string;
};

const colorMap: MasteryMap<Color> = {
  novice: {
    light: 'hsl(240, 1%, 81%)',
    normal: 'hsl(0, 0%, 51%)',
  },
  advanced: {
    light: 'hsl(201, 68%, 79%)',
    normal: 'hsl(201, 78%, 47%)',
  },
  competent: {
    light: 'hsl(124, 23%, 77%)',
    normal: 'hsl(123, 35%, 40%)',
  },
  proficient: {
    light: 'hsl(43, 98%, 83%)',
    normal: 'hsl(43, 99%, 55%)',
  },
  expert: {
    light: 'hsl(360, 56%, 83%)',
    normal: 'hsl(360, 56%, 53%)',
  },
};

const skillMap: MasteryMap<number> = {
  novice: 1 / 5,
  advanced: 2 / 5,
  competent: 3 / 5,
  proficient: 4 / 5,
  expert: 5 / 5,
};

type UserSkillProps = { mastery: Mastery; color?: Color; className?: string };

export const SkillBar: React.FC<UserSkillProps> = (props) => {
  const { mastery, color, className } = props;
  const nMastery = mastery.toLowerCase() as MasteryLevel;
  const t = skillMap[nMastery] ?? 0;
  const finalColor = color || (colorMap[nMastery] ?? colorMap.novice);

  return (
    <svg viewBox="0 0 80 4" className={cn('select-none w-[80px]', className)}>
      <rect
        className="fill-neutral-700 transition-[width,fill] w-full h-full"
        style={{
          fill: finalColor.light,
        }}
      />
      <rect
        className="fill-neutral-700 transition-[width,fill] h-full animate-enter"
        style={{
          width: `${t * 100}%`,
          fill: finalColor.normal,
        }}
      />
    </svg>
  );
};
