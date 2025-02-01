import React from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Link as MuiLink,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Gender } from '@/types/user';

export interface FormData {
  username: string;
  password: string;
  nickname: string;
  gender: Gender | '';
}

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export default function AuthForm({
  mode,
  onSubmit,
  isLoading,
  error,
}: AuthFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = React.useState<FormData>({
    username: '',
    password: '',
    nickname: '',
    gender: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Box
      component={Paper}
      sx={{
        p: 4,
        maxWidth: 400,
        mx: 'auto',
        mt: 8,
        width: '100%',
      }}
    >
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        {mode === 'login'
          ? t('common.login.title')
          : t('common.login.register')}
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <TextField
          fullWidth
          label={t('common.login.username')}
          name="username"
          value={formData.username}
          onChange={handleTextChange}
          margin="normal"
          required
          autoFocus
        />

        <TextField
          fullWidth
          label={t('common.login.password')}
          name="password"
          type="password"
          value={formData.password}
          onChange={handleTextChange}
          margin="normal"
          required
        />

        {mode === 'register' && (
          <>
            <TextField
              fullWidth
              label={t('common.user.profile.nickname')}
              name="nickname"
              value={formData.nickname}
              onChange={handleTextChange}
              margin="normal"
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>{t('common.user.profile.gender')}</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleSelectChange}
                label={t('common.user.profile.gender')}
              >
                <MenuItem value="male">{t('common.user.profile.male')}</MenuItem>
                <MenuItem value="female">{t('common.user.profile.female')}</MenuItem>
                <MenuItem value="other">{t('common.user.profile.other')}</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        {error && (
          <FormHelperText error sx={{ mt: 2 }}>
            {error}
          </FormHelperText>
        )}

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{ mt: 3, mb: 2 }}
        >
          {mode === 'login'
            ? t('common.login.submit')
            : t('common.login.register')}
        </Button>

        <Box sx={{ textAlign: 'center' }}>
          {mode === 'login' ? (
            <MuiLink component={Link} href="/register" variant="body2">
              还没有账号？立即注册
            </MuiLink>
          ) : (
            <MuiLink component={Link} href="/login" variant="body2">
              已有账号？立即登录
            </MuiLink>
          )}
        </Box>
      </Box>
    </Box>
  );
} 
