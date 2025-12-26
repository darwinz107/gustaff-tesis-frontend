export interface Cargo {
  id?: number;
  name: string;
  rolId:Rol;
}

export interface Rol {
  id: number;
  role: string;
}