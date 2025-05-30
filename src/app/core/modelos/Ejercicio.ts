import { Categoria } from '../../compartido/enums/Categoria';
import { TipoEjercicio } from '../../compartido/enums/TipoEjercicio';

export class Ejercicio {
    id: number;
    ejercicio: string;
    categoria: Categoria;
    tipoEjercicio: TipoEjercicio;

    constructor(id: number, ejercicio: string, categoria: Categoria, tipoEjercicio: TipoEjercicio) {
        this.id = id;
        this.ejercicio = ejercicio;
        this.categoria = categoria;
        this.tipoEjercicio = tipoEjercicio;
    }
}