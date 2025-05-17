export interface LoginResponseDTO {
  token: string;
  email: string;
  exito: boolean;
  requiereActivacion: boolean;
}
