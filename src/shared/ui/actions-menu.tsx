import { type ReactNode, useState, useImperativeHandle, forwardRef } from 'react';
import { IconButton, Menu } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

type PropsType = {
  children?: ReactNode;
};

export type ActionsMenuRef = {
  close: () => void;
};

export const ActionsMenu = forwardRef<ActionsMenuRef, PropsType>(({ children }, ref) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useImperativeHandle(ref, () => ({
    close: () => {
      handleClose();
    },
  }));

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        {children}
      </Menu>
    </>
  );
});
