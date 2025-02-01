import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Image from 'next/image';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  imageSrc?: string;
}

export default function EmptyState({
  title,
  description,
  actionText,
  onAction,
  imageSrc = '/empty-state.svg',
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 2,
      }}
    >
      <Image
        src={imageSrc}
        alt={title}
        width={200}
        height={200}
        style={{ opacity: 0.8 }}
      />
      <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {description}
        </Typography>
      )}
      {actionText && onAction && (
        <Button variant="contained" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </Box>
  );
} 