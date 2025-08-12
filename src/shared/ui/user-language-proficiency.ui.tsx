import { useTranslation } from 'react-i18next';
import { type LanguageProficiency } from '../types';
import { cn } from '../utils';

type UserLanguageProficiencyProps = { value: LanguageProficiency; className?: string } & React.ComponentProps<'div'>;

const colorMap: Record<LanguageProficiency['proficiency'], string> = {
  A1: 'hsl(0, 0%, 61%)',
  A2: 'hsl(0, 0%, 51%)',
  B1: 'hsl(201, 78%, 47%)',
  B2: 'hsl(123, 35%, 40%)',
  C1: 'hsl(43, 99%, 55%)',
  C2: 'hsl(43, 99%, 45%)',
  Native: 'hsl(360, 56%, 53%)',
};

export const UserLanguageProficiency: React.FC<UserLanguageProficiencyProps> = (props) => {
  const { t } = useTranslation();
  const { value, className, ...rest } = props;

  return (
    <div className={cn('flex gap-2 xl:justify-between', className)} {...rest}>
      <span style={{ color: colorMap[value.proficiency] ?? '' }}>{value.proficiency}</span>
      <span>{t(value.name)}</span>
    </div>
  );
};
