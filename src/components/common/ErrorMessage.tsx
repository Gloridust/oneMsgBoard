import React from 'react';
import { Alert, AlertTitle, Box } from '@mui/material';

interface ErrorMessageProps {
  title?: string;
  message: string;
}

export default function ErrorMessage({
  title = '出错了',
  message,
}: ErrorMessageProps) {
  return (
    <Box sx={{ my: 2 }}>
      <Alert severity="error">
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Box>
  );
} 