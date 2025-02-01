import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { Comment } from '@/types/user';

interface CommentProps {
  comment: Comment & {
    author: {
      username: string;
      nickname?: string;
      avatarUrl?: string;
    };
  };
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export default function CommentComponent({
  comment,
  onEdit,
  onDelete,
  showActions = false,
}: CommentProps) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, py: 2 }}>
      <Avatar
        src={comment.author.avatarUrl}
        alt={comment.author.nickname || comment.author.username}
        sx={{ width: 32, height: 32 }}
      />
      <Box sx={{ flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2">
            {comment.author.nickname || comment.author.username}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {new Date(comment.createdAt).toLocaleString()}
          </Typography>
          {showActions && (onEdit || onDelete) && (
            <Box sx={{ ml: 'auto' }}>
              <IconButton
                size="small"
                onClick={handleMenu}
                sx={{ padding: 0.5 }}
              >
                <MoreVert fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {onEdit && (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      onEdit();
                    }}
                  >
                    {t('common.actions.edit')}
                  </MenuItem>
                )}
                {onDelete && (
                  <MenuItem
                    onClick={() => {
                      handleClose();
                      onDelete();
                    }}
                  >
                    {t('common.actions.delete')}
                  </MenuItem>
                )}
              </Menu>
            </Box>
          )}
        </Box>
        <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
          {comment.content}
        </Typography>
      </Box>
    </Box>
  );
}