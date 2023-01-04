export type LogInDTO = {
  email: string;
  password: string;
};

export interface TokenModel {
  access_token: string;
  refresh_token: string;
}

export interface UserProfile {
  email: string;
  nombre: string;
  sub: string;
  role: string;
  iat: number;
  exp: number;
}

export type SignUpDTO = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
};
