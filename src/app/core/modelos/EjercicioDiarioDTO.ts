export interface EjercicioDiarioDTO {
    id: number;
    nombre: string;
    descripcion: string;
    video: string;
    imagen: string;
    tiempo: number;
    repeticiones: number;
    idTipoEjercicio: number;
}