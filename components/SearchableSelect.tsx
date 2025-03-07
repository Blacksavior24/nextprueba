"use client";

import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options?: Option[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Selecciona una opción",
}) => {
  const [filter, setFilter] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  // Filtrar las opciones basadas en el texto ingresado
  const filteredOptions = options?.filter((option) =>
    option.label.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Select open={open} onOpenChange={setOpen} value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {/* Input de búsqueda */}
        <Input
          type="text"
          placeholder="Buscar..."
          value={filter}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilter(e.target.value)
          }
          className="mb-2"
        />

        {/* Opciones filtradas */}
        {filteredOptions?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SearchableSelect;