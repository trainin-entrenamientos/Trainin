export interface LoginResponseDTO {
  token: string;
  email: string;
  exito: boolean;
  requiereActivacion: boolean;
}


export interface responseDTO {
  exito: boolean;
  mensaje: string
  objeto: LoginResponseDTO;
}