"use client"

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login"); // Reemplaza la URL actual por /login
  }, []);

  return null; // No renderiza nada
  
}