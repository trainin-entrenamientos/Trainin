export interface RespuestaApi<T> {
  exito: boolean;
  mensaje: string;
  objeto: T;
}