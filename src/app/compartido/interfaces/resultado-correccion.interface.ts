export interface ResultadoCorreccion {
  mensaje: string | null;       // texto a mostrar / hablar
  color: 'green' | 'orange' | 'red' | ''; 
  repContada: boolean;          // si acabamos de contar réplica
  totalReps: number;            // cuántas repeticiones llevamos
  termino: boolean;             // si ya llegamos al tope
  resumenHtml?: string;         // HTML de resumen (si termino=true)
}