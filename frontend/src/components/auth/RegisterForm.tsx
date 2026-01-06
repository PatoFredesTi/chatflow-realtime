import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '../common';
import { registerSchema } from '../../utils/validators';
import type { RegisterFormData } from '../../utils/validators';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading?: boolean;
}

export const RegisterForm = ({ onSubmit, isLoading }: RegisterFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          label="Nombre de usuario"
          type="text"
          placeholder="johndoe"
          error={errors.username?.message}
          {...register('username')}
        />
      </div>

      <div>
        <Input
          label="Email"
          type="email"
          placeholder="tu@email.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div>
        <Input
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <div>
        <Input
          label="Confirmar contraseña"
          type="password"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      <div className="text-sm text-gray-400">
        <label className="flex items-start">
          <input
            type="checkbox"
            className="mr-2 mt-1 rounded bg-gray-700 border-gray-600"
            required
          />
          <span>
            Acepto los{' '}
            <a href="#" className="text-blue-500 hover:text-blue-400">
              términos y condiciones
            </a>{' '}
            y la{' '}
            <a href="#" className="text-blue-500 hover:text-blue-400">
              política de privacidad
            </a>
          </span>
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        isLoading={isLoading}
      >
        Crear Cuenta
      </Button>
    </form>
  );
};