export interface LanguageFlag {
  lang: string;
  name: string;
  flag: string;
  active?: boolean;
}

export interface enviarDatosUsuario {
  id: number;
  nombreCorto: string;
  nombre: string;
  apellido: string;
  telefono: string;
  idioma: string;
  imagen: string | null;
  cargo: string;
  numero_identificacion: string;
}

export interface UsuarioInformacionPerfil extends Partial<Usuario> {
  indicativoPais: string;
}

export interface Usuario {
  id: string;
  username: string;
  cargo: string;
  imagen: string;
  nombre_corto: string;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  idioma: string;
  dominio: string;
  fecha_limite_pago: Date;
  vr_saldo: number;
  numero_identificacion: string;
  is_active: boolean;
  socio_id: number | null;
  verificado: boolean;
  empresa_nombre: string;
  empresa_numero_identificacion: string;
}
