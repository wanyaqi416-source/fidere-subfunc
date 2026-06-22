import React from 'react';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HelpOutline from '@mui/icons-material/HelpOutline';
import Language from '@mui/icons-material/Language';
import NotificationsNone from '@mui/icons-material/NotificationsNone';
import BrokerAccountOpeningPage from './broker-account-opening/BrokerAccountOpeningPage';

function Header() {
  const navItems = ['Dashboard', 'Accounts', 'Investment', 'Transactions', 'Trust Services'];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={(theme) => ({
        bgcolor: 'primary.main',
        borderBottom: `1px solid ${theme.palette.primary.dark}`,
      })}
    >
      <Toolbar
        sx={(theme) => ({
          minHeight: { xs: 56, md: 64 },
          px: { xs: theme.spacing(2), md: theme.spacing(3) },
          gap: theme.spacing(3),
        })}
      >
        <Typography variant="h5" sx={{ color: 'common.white', fontWeight: 700, flexShrink: 0 }}>
          FIDERE
        </Typography>

        <Stack
          component="nav"
          direction="row"
          spacing={3}
          sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', flex: 1 }}
        >
          {navItems.map((item) => (
            <Box
              key={item}
              sx={(theme) => ({
                color: 'common.white',
                opacity: item === 'Accounts' ? 1 : 0.78,
                ...theme.typography.body2,
                fontWeight: item === 'Accounts' ? 600 : 500,
                lineHeight: 1,
                position: 'relative',
                py: 1,
                '&::after':
                  item === 'Accounts'
                    ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: -theme.spacing(1.75),
                        height: 2,
                        borderRadius: 1,
                        bgcolor: 'common.white',
                      }
                    : undefined,
              })}
            >
              {item}
            </Box>
          ))}
        </Stack>

        <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 'auto' }}>
          <IconButton color="inherit" aria-label="notifications" sx={{ color: 'common.white' }}>
            <NotificationsNone fontSize="small" />
          </IconButton>
          <IconButton color="inherit" aria-label="language" sx={{ color: 'common.white' }}>
            <Language fontSize="small" />
          </IconButton>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: 'none', lg: 'block' }, borderColor: 'rgba(255,255,255,0.24)', mx: 1 }}
          />
          <Avatar
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=96&q=80"
            alt="Zhang Wei"
            sx={{ width: 36, height: 36, display: { xs: 'none', sm: 'flex' } }}
          />
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography sx={{ color: 'common.white', fontSize: 14, fontWeight: 600, lineHeight: 1.25 }}>
              Zhang Wei
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.68)', fontSize: 11, fontWeight: 500, letterSpacing: 0.8 }}>
              INDIVIDUAL ACCOUNT
            </Typography>
          </Box>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

function Footer() {
  return (
    <Box component="footer" sx={(theme) => ({ borderTop: `1px solid ${theme.palette.divider}`, mt: 2 })}>
      <Container maxWidth="lg" sx={(theme) => ({ py: theme.spacing(2.5) })}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <HelpOutline sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="caption" color="text.secondary">
                需要帮助？如有疑问或需要协助，请随时联系我们的客服团队。
              </Typography>
            </Stack>
            <Button variant="outlined" size="small" sx={{ whiteSpace: 'nowrap' }}>
              联系客服
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
            {['Help Center', 'Terms of Service', 'Privacy Policy'].map((item) => (
              <Link key={item} href="#" underline="hover" variant="caption" color="text.secondary">
                {item}
              </Link>
            ))}
            <Typography variant="caption" color="text.secondary">
              © 2024 FIDERE Trust. Professional Fiduciary Services.
            </Typography>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      <Header />
      <BrokerAccountOpeningPage />
      <Footer />
    </Box>
  );
}
