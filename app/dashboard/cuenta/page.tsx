"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Usuario } from "@/interfaces/usuarios.interfaces"
import { useGetUser } from "@/lib/queries/users.queries"
import { useAuthStore } from "@/store/auth.store"
import { useState, useEffect } from "react"

export default function UserProfilePage() {
  const [userData, setUserData] = useState<Usuario>()
  const { user, isLoading } = useAuthStore()

  const userId = user?.id ? user.id.toString(): ""
  const { data: userResponse, isLoading: isLoadingUser } = useGetUser(userId)

  useEffect(() => {
    if (userResponse) {
      setUserData(userResponse)
    }
  }, [userResponse])

  if (isLoading || isLoadingUser) {
    return (
      <div className="flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Cargando...</span>
      </div>
    )
  }

  if (!user) {
    return <div>No se ha encontrado información del usuario.</div>
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Perfil de Usuario</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-semibold">Nombre:</Label>
            <p>{userData?.nombre}</p>
          </div>
          <div>
            <Label className="font-semibold">Email:</Label>
            <p>{userData?.email}</p>
          </div>
          <div>
            <Label className="font-semibold">Tipo de Usuario:</Label>
            <p className="capitalize">{userData?.tipoUsuario}</p>
          </div>
          <div>
            <Label className="font-semibold">Rol ID:</Label>
            <p>{userData?.rolId}</p>
          </div>
          <div>
            <Label className="font-semibold">Jefe:</Label>
            <p className="capitalize">{userData?.jefe}</p>
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