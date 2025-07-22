import { clamp } from 'lodash';
import { cn, lerp, smoothstep } from '~/shared';

type UserSkillProps = { level: number; className?: string };

export const UserSkill: React.FC<UserSkillProps> = (props) => {
  const { level, className } = props;
  const cLevel = clamp(level, 0, 10);
  const t = cLevel / 10;

  return (
    <svg viewBox="0 0 80 4" className={cn('select-none w-[80px]', className)}>
      <rect
        className="fill-neutral-700 transition-[width,fill] w-full h-full"
        style={{
          fill: `hsl(${lerp(240, 0, t)}, ${lerp(0, 25, smoothstep(0, 0.5, t))}%, 80%)`,
        }}
      />
      <rect
        className="fill-neutral-700 transition-[width,fill] h-full animate-enter"
        style={{
          width: `${t * 100}%`,
          fill: `hsl(${lerp(240, 0, t)}, ${lerp(0, 100, smoothstep(0, 0.35, t))}%, 35%)`,
        }}
      />
    </svg>
  );
};
