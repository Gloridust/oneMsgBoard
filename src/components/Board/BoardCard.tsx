import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Board } from '@/types/user';
import Link from 'next/link';
import { Public, Lock } from '@mui/icons-material';

interface BoardCardProps {
  board: Board;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export default function BoardCard({
  board,
  onEdit,
  onDelete,
  showActions = false,
}: BoardCardProps) {
  const { t } = useTranslation();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
          <Typography variant="h6" component="div">
            {board.name}
          </Typography>
          {board.isPublic ? (
            <Chip
              icon={<Public fontSize="small" />}
              label="公开"
              size="small"
              color="primary"
            />
          ) : (
            <Chip
              icon={<Lock fontSize="small" />}
              label="私密"
              size="small"
              color="default"
            />
          )}
        </Box>
        {board.description && (
          <Typography variant="body2" color="text.secondary">
            {board.description}
          </Typography>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          创建于 {new Date(board.createdAt).toLocaleDateString()}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} href={`/boards/${board.id}`}>
          查看
        </Button>
        {showActions && (
          <>
            {onEdit && (
              <Button size="small" onClick={onEdit}>
                {t('common.actions.edit')}
              </Button>
            )}
            {onDelete && (
              <Button size="small" color="error" onClick={onDelete}>
                {t('common.actions.delete')}
              </Button>
            )}
          </>
        )}
      </CardActions>
    </Card>
  );
} 