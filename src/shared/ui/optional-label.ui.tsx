import { useTranslation } from 'react-i18next';

type OptionalFieldProps = { children?: React.ReactNode };

export const OptionalLabel: React.FC<OptionalFieldProps> = (props) => {
  const { children } = props;
  const { t } = useTranslation();

  if (children) {
    return children;
  }

  return <div className="italic text-neutral-400 text-sm">{t('Not specified')}</div>;
};
