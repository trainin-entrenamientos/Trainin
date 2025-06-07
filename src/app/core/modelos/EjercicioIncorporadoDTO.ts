export interface EjercicioIncorporadoDTO {
  id: number;
  nombre: string;
  idGrupoMuscular: number;   
  descripcion: string;
  video: string;
  valorMet: number;
  landmark: string | null;            
  tieneCorreccion: boolean;
  imagen: string;
  correccionPremium: boolean;

  ejercicioCategorias: any[] | null;
  ejercicioGrupoMuscular: any[] | null;
}

export interface CategoriaEjercicio {
  idCategoriaEjercicio: number;
  nombre: string;
}

export interface GrupoMuscular {
  idGrupoMuscular: number;
  descripcion: string;
}

  
  /*constructor(id: number, nombre: string, descripcion: string, idGrupoMuscular: number, grupoMuscular: {nombre: string},
    video: string, idCategoriaEjercicio: number, categoriaEjercicio: {nombre: string}, valorMet: number, landmark: string,
    tieneCorreccion: boolean, imagen: string, correccionPremium: boolean)
   {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.idGrupoMuscular = idGrupoMuscular;
    this.grupoMuscular = grupoMuscular;
    this.video = video;
    this.idCategoriaEjercicio = idCategoriaEjercicio;
    this.categoriaEjercicio = categoriaEjercicio;
    this.valorMet = valorMet;
    this.landmark = landmark;
    this.tieneCorreccion = tieneCorreccion;
    this.imagen = imagen;
    this.correccionPremium = correccionPremium;
  }
*/

