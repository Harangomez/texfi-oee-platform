export interface Usuario {
  id?: number;
  nombre: string;
  password: string;
  rol: 'taller' | 'cliente' | 'admin';
  plan: 'gratuito' | 'premium' | 'empresa';
  fechaVencimientoPlan?: Date;
  caracteristicas?: object;
  activo: boolean;
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  cliente?: Cliente;
  taller?: Taller;
}

export interface Taller {
  id?: number;
  pais: string;
  nombre: string;
  identificacion: string;
  email: string;
  telefono: string;
  usuarioId?: number;
  maquinas?: Maquina[];
  operarios?: Operario[];
  clientes?: Cliente[];
  producciones?: Produccion[];
  usuario?: Usuario;
}

export interface Cliente {
  id?: number;
  pais: string;
  nombre: string;
  identificacion: string;
  contacto: string;
  email: string;
  telefono: string;
  usuarioId?: number;
  talleres?: Taller[];
  productos?: Producto[];
  usuario?: Usuario;
}

export interface Maquina {
  id?: number;
  nombre: string;
  tipo: string;
  activo?: boolean;
  tallerId?: number;
  taller?: Taller;
  producciones?: Produccion[];
}

export interface Operario {
  id?: number;
  nombre: string;
  identificacion: string;
  activo?: boolean;
  tallerId?: number;
  taller?: Taller;
  producciones?: Produccion[];
}

export interface Producto {
  id?: number;
  referencia: string;
  descripcion?: string;
  tiempoEstandar?: number;
  clienteId?: number;
  cliente?: Cliente;
  operaciones?: Operacion[];
  producciones?: Produccion[];
}

export interface Operacion {
  id?: number;
  nombre: string;
  productos?: Producto[];
}

export interface Produccion {
  id?: number;
  fecha: Date;
  tiempoPlanificado: number;
  tiempoParo: number;
  programado?: boolean;
  motivoParo?: string;
  tallerId?: number;
  maquinas?: Maquina[];
  operarios?: Operario[];
  productos?: Producto[];
  detallesProduccion?: DetalleProduccion[];
  taller?: Taller;
}

export interface DetalleProduccion {
  id?: number;
  cantidadProducida: number;
  unidadesDefectuosas: number;
  produccionId?: number;
  productoId?: number;
  producto?: Producto;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  usuario: {
    nombre: string;
    password: string; // Quitar email de aquí
    rol: 'taller' | 'cliente';
    plan: 'gratuito' | 'premium' | 'empresa';
  };
  taller?: Omit<Taller, 'id' | 'usuarioId'>;
  cliente?: Omit<Cliente, 'id' | 'usuarioId'>;
}

// Agregar al final del archivo
export interface ClienteWithRelations extends Cliente {
  talleres?: Taller[];
  productos?: Producto[];
  usuario?: Usuario;
}

export interface TallerWithRelations extends Taller {
  maquinas?: Maquina[];
  operarios?: Operario[];
  clientes?: Cliente[];
  producciones?: Produccion[];
  usuario?: Usuario;
}

export interface MaquinaWithRelations extends Maquina {
  taller?: Taller;
  producciones?: Produccion[];
}

export interface OperarioWithRelations extends Operario {
  taller?: Taller;
  producciones?: Produccion[];
}

export interface ProductoWithRelations extends Producto {
  cliente?: Cliente;
  operaciones?: Operacion[];
  producciones?: Produccion[];
}

export interface OperacionWithRelations extends Operacion {
  productos?: Producto[];
}

export interface ProduccionWithRelations extends Produccion {
  taller?: Taller;
  maquinas?: Maquina[];
  operarios?: Operario[];
  productos?: Producto[];
  detallesProduccion?: DetalleProduccion[];
}

export interface ProduccionMaquina {
  id?: number;
  produccionId?: number;
  maquinaId?: number;
}

export interface ProduccionOperario {
  id?: number;
  produccionId?: number;
  operarioId?: number;
}