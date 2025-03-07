"use client"
import { Button } from '@/components/ui/button'; // ShadCN Button
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';   // ShadCN Input
import { Label } from '@/components/ui/label';   // ShadCN Label
import { useAuthStore } from '@/store/auth.store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

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
      <div 
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4"
        style={{
          backgroundImage: `url('cartas.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Iniciar sesión</CardTitle>
          <CardDescription className="text-center text-gray-500">Ingresa tus credenciales para acceder</CardDescription>
        </CardHeader>
        <CardContent>
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
  
            {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

            <Button className="w-full mt-4" disabled={isLoading}>
                  {isLoading ? <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Cargando
                  </> : 'Iniciar sesión'}
                </Button>
          </form>
  
          <div className="text-center mt-4">
            <Link href="/dashboard" className="text-sm text-blue-500">¿Olvidaste tu contraseña?</Link>
          </div>
        </CardContent>
        </Card>
    
      </div>
    );
}