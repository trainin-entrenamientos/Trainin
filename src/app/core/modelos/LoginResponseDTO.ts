export interface LoginResponseDTO {
  exito: boolean;
  mensaje: string;
  objeto: LoginData;
}

export interface LoginData {
  token: string;
  email: string;
  exito: boolean;
  requiereActivacion: boolean;
}
