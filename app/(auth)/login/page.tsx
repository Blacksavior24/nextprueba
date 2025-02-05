"use client"
import { Button } from '@/components/ui/button'; // ShadCN Button
import { Input } from '@/components/ui/input';   // ShadCN Input
import { Label } from '@/components/ui/label';   // ShadCN Label
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Page(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    const {login, isLoading, error, token} = useAuthStore();
  
    const router = useRouter()
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await login(email, password)
    };
  
    // Efecto para redirigir al dashboard si hay un token
    useEffect(() => {
      if (token) {
        router.push('/dashboard'); // Redirige solo si hay un token
      }
    }, [token, router]);
  
  
  
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-4">Iniciar sesión</h2>
  
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingresa tu correo electrónico"
                className="mt-1"
                value={email}
                onChange={(e)=> setEmail(e.target.value)}
              />
            </div>
  
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingresa tu contraseña"
                className="mt-1"
                value={password}
                onChange={(e)=> setPassword(e.target.value)}
              />
            </div>
  
            {error && 
              <div className='bg-red-500 p-3 rounded-lg '>
                <p className="text-red-50 text-sm text-center font-bold">
                  {error}
                </p>
              </div>
              }
  
            {/* <Link href="/dashboard">  
              
                <Button className="w-full mt-4" disabled={isLoading}>
                  {isLoading ? 'Cargando' : 'Iniciar sesión'}
                </Button>
            </Link> */}
            <Button className="w-full mt-4" disabled={isLoading}>
                  {isLoading ? 'Cargando' : 'Iniciar sesión'}
                </Button>
          </form>
  
          <div className="text-center mt-4">
            <Link href="/dashboard" className="text-sm text-blue-500">¿Olvidaste tu contraseña?</Link>
          </div>
        </div>
      </div>
    );
}