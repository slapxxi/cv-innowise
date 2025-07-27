import { MoreVert as DotsIcon } from '@mui/icons-material';
import { IconButton, Menu } from '@mui/material';
import { useState } from 'react';

type ActionMenuProps = { children: React.ReactNode };

export const ActionMenu: React.FC<ActionMenuProps> = (props) => {
  const { children } = props;
  const [menuOpen, setMenuOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  function handleOpenMenu(e: React.MouseEvent<HTMLButtonElement>) {
    setMenuOpen(true);
    setAnchorEl(e.currentTarget);
  }

  function handleCloseMenu() {
    setMenuOpen(false);
    setAnchorEl(null);
  }

  return (
    <>
      <IconButton className="hover:opacity-55" onClick={handleOpenMenu}>
        <DotsIcon />
      </IconButton>
      <Menu anchorEl={anchorEl} open={menuOpen} onClose={handleCloseMenu}>
        {children}
      </Menu>
    </>
  );
};
