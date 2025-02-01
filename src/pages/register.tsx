import React from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';
import AuthForm from '@/components/Auth/AuthForm';
import { registerSchema } from '@/lib/validations';
import { z } from 'zod';
import { FormData } from '@/components/Auth/AuthForm';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [error, setError] = React.useState<string>();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      setError(undefined);
      setIsLoading(true);

      // 验证并转换数据
      const data = registerSchema.parse({
        ...formData,
        gender: formData.gender || undefined,
      });

      await register(data.username, data.password);
      router.push('/');
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError('输入数据格式不正确');
      } else {
        setError(err instanceof Error ? err.message : '注册失败，请重试');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm
      mode="register"
      onSubmit={handleSubmit}
      isLoading={isLoading}
      error={error}
    />
  );
} 
