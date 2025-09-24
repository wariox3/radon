export interface ViajeLista {
  viajes: Viaje[];
}

export interface Viaje {
  datos: Datos;
  propuestas: Propuesta[];
}

export interface Datos {
  id: number;
  fecha: string;
  cliente: string;
  unidades: number;
  peso: number;
  volumen: number;
  puntos_entrega: number;
  comentario?: string;
  propuestas: number;
  estado_aceptado: boolean;
  ciudad_origen_id: number;
  ciudad_origen__nombre: string;
  ciudad_destino_id: number;
  ciudad_destino__nombre: string;
  servicio_id: number;
  servicio__nombre: string;
  producto_id: number;
  producto__nombre: string;
  empaque_id: number;
  empaque__nombre: string;
  usuario_id: number;
  usuario__nombre_corto: string;
}

export interface Propuesta {
  id: number;
  precio: number;
  contenedor_id: number;
  schema_name: string;
  empresa: string;
  usuario: number;
  viaje: number;
}

export interface ViajeDetalle {
  id: number;
  fecha: string;
  cliente: string;
  unidades: number;
  peso: number;
  volumen: number;
  negocio_id: number;
  contenedor_id: number;
  schema_name: string;
  solicitud_cliente: boolean;
  estado_aceptado: boolean;
  estado_aceptado_transporte: boolean;
  flete: number;
  puntos_entrega: number;
  comentario: string;
  propuestas: number;
  servicio: number;
  producto: number;
  empaque: number;
  vehiculo: number;
  conductor: number;
  usuario: number;
  ciudad_origen: number;
  ciudad_destino: number;
}
