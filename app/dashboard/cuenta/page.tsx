"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

const userData = {
  id: "1",
  nombre: "Ana",
  email: "ana@example.com",
  apellidos: null,
  contraseña: "$2b$10$ZX2b62pLpykx73mgGo6ydO5ExXr0BeG.z.dhgL1cnQg5vNSYgR4NC",
  areaId: null,
  subAreaId: null,
  rolId: "2",
  procedencia: null,
  tipoUsuario: "admin",
  jefe: "no",
  creadoPorId: null,
}

export default function UserProfilePage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Perfil de Usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-semibold">Nombre:</Label>
            <p>{userData.nombre}</p>
          </div>
          <div>
            <Label className="font-semibold">Email:</Label>
            <p>{userData.email}</p>
          </div>
          <div>
            <Label className="font-semibold">Tipo de Usuario:</Label>
            <p className="capitalize">{userData.tipoUsuario}</p>
          </div>
          <div>
            <Label className="font-semibold">Rol ID:</Label>
            <p>{userData.rolId}</p>
          </div>
          <div>
            <Label className="font-semibold">Jefe:</Label>
            <p className="capitalize">{userData.jefe}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => alert("Funcionalidad para cambiar contraseña")}>
            Cambiar Contraseña
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

