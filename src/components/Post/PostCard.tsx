import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Box,
  IconButton,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Post } from '@/types/user';
import { ThumbUp, Comment as CommentIcon } from '@mui/icons-material';

interface PostCardProps {
  post: Post & {
    author: {
      username: string;
      nickname?: string;
      avatarUrl?: string;
    };
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
  };
  onLike?: () => void;
  onComment?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showActions?: boolean;
}

export default function PostCard({
  post,
  onLike,
  onComment,
  onEdit,
  onDelete,
  showActions = false,
}: PostCardProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={post.author.avatarUrl}
            alt={post.author.nickname || post.author.username}
            sx={{ mr: 2 }}
          />
          <Box>
            <Typography variant="subtitle1">
              {post.author.nickname || post.author.username}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(post.createdAt).toLocaleString()}
              {post.updatedAt && (
                <>
                  {' '}
                  · {t('common.post.lastEdited')}{' '}
                  {new Date(post.updatedAt).toLocaleString()}
                </>
              )}
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
          {post.content}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, gap: 2 }}>
          <IconButton
            onClick={onLike}
            color={post.isLiked ? 'primary' : 'default'}
            size="small"
          >
            <ThumbUp fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post.likesCount}
          </Typography>

          <IconButton onClick={onComment} size="small">
            <CommentIcon fontSize="small" />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {post.commentsCount}
          </Typography>
        </Box>
      </CardContent>

      {showActions && (
        <CardActions>
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
        </CardActions>
      )}
    </Card>
  );
} 