import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm, { FormData } from '@/components/Auth/AuthForm';
import { loginSchema } from '@/lib/validations';
import { z } from 'zod';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      setError(undefined);
      setIsLoading(true);

      // 验证数据
      const data = loginSchema.parse(formData);
      await login(data.username, data.password);
      router.push('/');
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError('输入数据格式不正确');
      } else {
        setError(err instanceof Error ? err.message : '登录失败，请重试');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      mode="login"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
} 