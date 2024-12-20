import { Button } from '@/components/ui/button'; // ShadCN Button
import { Input } from '@/components/ui/input';   // ShadCN Input
import { Label } from '@/components/ui/label';   // ShadCN Label
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4">Iniciar sesión</h2>

        <form className="space-y-4">
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              className="mt-1"
            />
          </div>
          <Link href="/dashboard">  {/* Cambia '/dashboard' por la URL a la que deseas redirigir */}
            
              <Button className="w-full mt-4">Iniciar sesión</Button>
          </Link>
        </form>

        <div className="text-center mt-4">
          <Link href="/dashboard" className="text-sm text-blue-500">¿Olvidaste tu contraseña?</Link>
        </div>
      </div>
    </div>
  );
}