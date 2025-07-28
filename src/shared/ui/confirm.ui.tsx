import { Dialog, DialogActions, DialogContent, DialogContentText } from './dialog.ui';
import { Button } from '~/shared';

type ConfirmProps = {
  title: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
  onCancel?: () => void;
} & React.ComponentProps<typeof Dialog>;

export const Confirm: React.FC<ConfirmProps> = (props) => {
  const { title, children, onConfirm, onCancel, ...rest } = props;

  return (
    <Dialog title={title} onClose={onCancel} {...rest}>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">{children}</DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onConfirm}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};
