export interface ResultadoCorreccion {
  mensaje: string | null;       
  color: 'green' | 'orange' | 'red' | ''; 
  repContada: boolean;          
  totalReps: number;            
  termino: boolean;             
  resumenHtml?: string;         
}