import { MoreVert as DotsIcon } from '@mui/icons-material';
import { IconButton, Menu, MenuItem } from '@mui/material';
import { createLink } from '@tanstack/react-router';
import React, { useState } from 'react';

type ActionMenuProps = {
  trigger?: React.ReactElement<{ onClick?: (e: React.MouseEvent<HTMLElement>) => void }>;
  children: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
} & Omit<React.ComponentProps<typeof Menu>, 'open'>;

export const ActionMenu: React.FC<ActionMenuProps> = (props) => {
  const { trigger, children, open, defaultOpen = false, onOpen, onClose, ...rest } = props;
  const isControlled = open !== undefined;
  const [menuOpen, setMenuOpen] = useState(defaultOpen);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const actualOpen = isControlled ? open : menuOpen;

  function handleOpenMenu(e: React.MouseEvent<HTMLElement>) {
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

  const triggerElement = trigger
    ? React.cloneElement(trigger, {
        onClick: handleOpenMenu,
      })
    : null;

  return (
    <>
      {triggerElement ? (
        triggerElement
      ) : (
        <IconButton className="hover:opacity-55" onClick={handleOpenMenu}>
          <DotsIcon />
        </IconButton>
      )}
      <Menu anchorEl={anchorEl} open={actualOpen} onClose={handleCloseMenu} {...rest}>
        {children}
      </Menu>
    </>
  );
};

export const ActionMenuItem = MenuItem;

export const ActionMenuItemLink = createLink(ActionMenuItem);
