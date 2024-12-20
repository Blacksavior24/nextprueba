'use client'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { UserForm } from '@/components/user-form'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import React, { useState } from 'react'

interface User {
    name: string
    email: string
    area: string
    subArea: string
    origin: string
    userType: string
    isManager: string
  }
  
  // Simulated larger dataset
  const users: User[] = Array.from({ length: 50 }, (_, index) => ({
    name: `USUARIO LASTUSER SECONDLAST ${index + 1}`,
    email: `usuario${index + 1}@intersur.com.pe`,
    area: "COMERCIAL",
    subArea: "SUBCONTRATOS",
    origin: "OBRA",
    userType: "UNIDAD",
    isManager: "No",
  }))
  
  const ITEMS_PER_PAGE = 8

export default function Page() {
    const [currentPage, setCurrentPage] = useState(1)
  
    // Calculate total pages
    const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE)
    
    // Get current page items
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const currentUsers = users.slice(startIndex, endIndex)
  
    // Generate page numbers array
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)
  
    return (
      <div className="container mx-auto px-10">
        <div className="rounded-md border">
          <div className="p-4">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Administración de Usuarios
            </h2>
            <div className="flex justify-between items-center mb-4">
              <UserForm />
              <div className="flex items-center gap-2">
                <span>Buscar:</span>
                <Input
                  type="search"
                  placeholder="Buscar..."
                  className="max-w-sm"
                />
              </div>
            </div>
          </div>
  
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre y Apellidos</TableHead>
                <TableHead>Correo</TableHead>
                <TableHead>Área Pertenece</TableHead>
                <TableHead>Sub Área</TableHead>
                <TableHead>Procedencia</TableHead>
                <TableHead>Tipo Usuario</TableHead>
                <TableHead>Jefe</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.area}</TableCell>
                  <TableCell>{user.subArea}</TableCell>
                  <TableCell>{user.origin}</TableCell>
                  <TableCell>{user.userType}</TableCell>
                  <TableCell>{user.isManager}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-blue-600">
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
  
          <div className="p-4 border-t">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                
                {pageNumbers.map((pageNumber) => {
                  // Show first page, current page, last page, and pages around current
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(pageNumber)
                          }}
                          isActive={currentPage === pageNumber}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }
                  return null
                })}
  
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault()
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    )
}
