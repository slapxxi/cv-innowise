import { Close as CloseIcon } from '@mui/icons-material';
import { Dialog as BaseDialog, DialogTitle, IconButton } from '@mui/material';
import { cn } from '../utils';

export { DialogActions, DialogContent, DialogContentText } from '@mui/material';

type DialogProps = { title: string; onClose?: () => void } & Omit<React.ComponentProps<typeof BaseDialog>, 'onClose'>;

export const Dialog: React.FC<DialogProps> = (props) => {
  const { open, title, onClose, children, ...rest } = props;

  function handleClose() {
    onClose?.();
  }

  return (
    <BaseDialog open={open} onClose={onClose} className={cn('dark:text-white')} {...rest}>
      <DialogTitle className="flex items-center">
        <span>{title}</span>
        <IconButton onClick={handleClose} className="ml-auto">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {children}
    </BaseDialog>
  );
};
