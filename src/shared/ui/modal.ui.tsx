import { Close as CloseIcon } from '@mui/icons-material';
import { Modal as BaseModal, IconButton } from '@mui/material';
import { cva } from 'class-variance-authority';

type ModalProps = { title: string; children?: React.ReactNode; size?: 'md' | 'lg' } & Omit<
  React.ComponentProps<typeof BaseModal>,
  'children'
>;

const modalVariants = cva(
  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-bg p-4 rounded shadow-lg w-3/4 dark:bg-neutral-600',
  {
    variants: {
      size: {
        md: 'max-w-[600px]',
        lg: 'max-w-[900px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export const Modal: React.FC<ModalProps> = (props) => {
  const { children, title, onClose, className, size, ...rest } = props;

  return (
    <BaseModal onClose={onClose} {...rest}>
      <div className={modalVariants({ size, className })}>
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
