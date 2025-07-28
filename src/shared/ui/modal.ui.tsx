import { Close as CloseIcon } from '@mui/icons-material';
import { Modal as BaseModal, IconButton } from '@mui/material';
import { cn } from '~/shared';

type ModalProps = { title: string; children?: React.ReactNode } & Omit<
  React.ComponentProps<typeof BaseModal>,
  'children'
>;

export const Modal: React.FC<ModalProps> = (props) => {
  const { children, title, onClose, ...rest } = props;

  return (
    <BaseModal onClose={onClose} {...rest}>
      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg p-4 rounded shadow-lg w-3/4 max-w-[600px]',
          'dark:bg-neutral-600'
        )}
      >
        <header className="flex items-center justify-between">
          <h2 className="font-semibold">{title}</h2>
          <IconButton aria-label="close" onClick={(e) => onClose?.(e, 'backdropClick')}>
            <CloseIcon />
          </IconButton>
        </header>

        {children}
      </div>
    </BaseModal>
  );
};
