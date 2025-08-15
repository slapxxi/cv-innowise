import { useTranslation } from 'react-i18next';
import { cn } from '../utils';

type OptionalFieldProps = { text?: string; children?: React.ReactNode; className?: string };

export const OptionalLabel: React.FC<OptionalFieldProps> = (props) => {
  const { text, children, className } = props;
  const { t } = useTranslation();

  if (children) {
    return children;
  }

  return <div className={cn('italic text-neutral-400 text-sm', className)}>{text || t('Not specified')}</div>;
};
