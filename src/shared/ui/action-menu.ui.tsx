import { MoreVert as DotsIcon } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { createLink } from '@tanstack/react-router';
import { useState } from 'react';

type ActionMenuProps = {
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
} & Omit<React.ComponentProps<typeof Menu>, 'open'>;

export const ActionMenu: React.FC<ActionMenuProps> = (props) => {
  const { children, open, defaultOpen = false, onOpen, onClose, ...rest } = props;
  const isControlled = open !== undefined;
  const [menuOpen, setMenuOpen] = useState(defaultOpen);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const actualOpen = isControlled ? open : menuOpen;

  function handleOpenMenu(e: React.MouseEvent<HTMLButtonElement>) {
    if (!isControlled) {
      setMenuOpen(true);
    }
    setAnchorEl(e.currentTarget);
    onOpen?.();
  }

  function handleCloseMenu() {
    if (!isControlled) {
      setMenuOpen(false);
    }
    setAnchorEl(null);
    onClose?.();
  }

  return (
    <>
      <IconButton className="hover:opacity-55" onClick={handleOpenMenu}>
        <DotsIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={actualOpen} onClose={handleCloseMenu} {...rest}>
        {children}
      </Menu>
    </>
  );
};

export const ActionMenuItem = MenuItem;

export const ActionMenuItemLink = createLink(ActionMenuItem);
