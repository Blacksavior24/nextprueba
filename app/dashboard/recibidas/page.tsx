'use client'
import { useState } from "react";
import { Input } from "@/components/ui/input"; // Usamos el Input de ShadCN UI para el buscador

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([
    { 
      codigo: "001", 
      destinatario: "Juan Pérez", 
      asunto: "Informe de ventas", 
      fechaIngreso: "2024-12-10", 
      cartaRecibida: "Sí", 
      devuelto: "No", 
      estado: "Pendiente"
    },
    { 
      codigo: "002", 
      destinatario: "Ana Gómez", 
      asunto: "Reunión de equipo", 
      fechaIngreso: "2024-12-12", 
      cartaRecibida: "No", 
      devuelto: "Sí", 
      estado: "Completado"
    },
    // Más datos aquí
  ]);

  // Filtrar datos según la búsqueda
  const filteredData = data.filter(item => 
    item.codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.destinatario.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.asunto.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Función para manejar la eliminación
  const handleDelete = (codigo:string) => {
    setData(data.filter(item => item.codigo !== codigo));
  };

  // Función para manejar la edición
  const handleEdit = (codigo:string) => {
    alert(`Editar item con código: ${codigo}`); // Aquí puedes implementar la lógica de edición
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Tabla de Registros</h1>

      {/* Buscador usando Input de ShadCN UI */}
      <div className="mb-4">
        <Input 
          type="text" 
          placeholder="Buscar..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-zinc-200">
        <table className="min-w-full table-auto">
          <thead className="bg-zinc-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Código Recibido</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Destinatario</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Asunto Recibido</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Fecha Ingreso</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Carta Recibida</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Devuelto</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Estado</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-zinc-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index} className="border-t hover:bg-zinc-50">
                  <td className="px-4 py-3 text-sm text-zinc-700">{item.codigo}</td>
                  <td className="px-4 py-3 text-sm text-zinc-700">{item.destinatario}</td>
                  <td className="px-4 py-3 text-sm text-zinc-700">{item.asunto}</td>
                  <td className="px-4 py-3 text-sm text-zinc-700">{item.fechaIngreso}</td>
                  <td className="px-4 py-3 text-sm text-zinc-700">{item.cartaRecibida}</td>
                  <td className="px-4 py-3 text-sm text-zinc-700">{item.devuelto}</td>
                  <td className="px-4 py-3 text-sm text-zinc-700">{item.estado}</td>
                  <td className="px-4 py-3 text-sm text-zinc-700">
                    <button
                      onClick={() => handleEdit(item.codigo)}
                      className="mr-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.codigo)}
                      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-400"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-3 text-center text-zinc-500">No se encontraron resultados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
