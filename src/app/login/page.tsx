'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';
const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const errorMap = {
  Unauthorized: 'Invalid email or password',
  InternalServerError: 'An unexpected error occurred. Please try again later.',
  'Not Found': 'Account does not exist.',
};

export default function LoginPage() {
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const { setUser } = useAuth();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(values),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      }
      router.push('/dashboard');
    } else {
      const data: { error?: string } = await res.json();
      const errorMsg =
        (data.error && errorMap[data.error as keyof typeof errorMap]) || 'Invalid credentials';
      form.setError('email', { message: errorMsg });
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md">
      <h2 className="mb-6 text-2xl font-bold">Login</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full cursor-pointer">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
