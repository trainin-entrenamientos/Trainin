export interface EjercicioIncorporadoDTO {
  id: number;
  nombre: string;
  descripcion: string;
  idGrupoMuscular: number;
  grupoMuscular: { nombre: string };
  video: string;
  idCategoriaEjercicio: number;
  categoriaEjercicio: { nombre: string };
  valorMet: number;
  landmark: string;
  tieneCorreccion: boolean;
  imagen: string;
  correccionPremium: boolean;
}