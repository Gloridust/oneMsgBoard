import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Language as LanguageIcon } from '@mui/icons-material';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    handleLangClose();
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
    router.push('/login');
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component={Link} href="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          oneMsgBoard
        </Typography>

        <IconButton color="inherit" onClick={handleLangMenu}>
          <LanguageIcon />
        </IconButton>
        <Menu
          anchorEl={langAnchorEl}
          open={Boolean(langAnchorEl)}
          onClose={handleLangClose}
        >
          <MenuItem onClick={() => handleLanguageChange('zh')}>中文</MenuItem>
          <MenuItem onClick={() => handleLanguageChange('en')}>English</MenuItem>
        </Menu>

        {user ? (
          <>
            <Button color="inherit" component={Link} href="/boards">
              {t('common.nav.boards')}
            </Button>
            {user.role === 'admin' && (
              <Button color="inherit" component={Link} href="/admin">
                {t('common.nav.admin')}
              </Button>
            )}
            <Box sx={{ ml: 2 }}>
              <IconButton onClick={handleMenu} sx={{ p: 0 }}>
                <Avatar alt={user.nickname || user.username} src={user.avatarUrl} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} href="/profile" onClick={handleClose}>
                  {t('common.nav.profile')}
                </MenuItem>
                <MenuItem onClick={handleLogout}>{t('common.actions.logout')}</MenuItem>
              </Menu>
            </Box>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} href="/login">
              {t('common.login.submit')}
            </Button>
            <Button color="inherit" component={Link} href="/register">
              {t('common.login.register')}
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
} 