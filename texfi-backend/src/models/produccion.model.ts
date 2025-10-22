import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Maquina} from './maquina.model';
import {Operario} from './operario.model';
import {Producto} from './producto.model';
import {DetalleProduccion} from './detalle-produccion.model';
import {Taller} from './taller.model';
import {ProduccionMaquina} from './produccion-maquina.model';
import {ProduccionOperario} from './produccion-operario.model';

@model()

export class Produccion extends Entity {
  
  @property({type: 'number', id: true, generated: true,}) id?: number;
  @property({type: 'date', default: 'now', required: true,}) fecha: Date; //Cambio de string por Date-required por default - true por $now
  @property({type: 'number', default: 0, required: true,}) tiempoPlanificado: number; //Total minutos planeados en el día. Solicitar en horas en el frontend y convertir a minutos al guardar en la base de datos
  @property({type: 'number', default: 0, required: true,}) tiempoParo: number;
  @property({type: 'boolean', default: false,}) programado: boolean; // true = sí (programado), false = no (no programado)
  @property({type: 'string',}) motivoParo?: string;
  
//Calculo de OEE: Disponibilidad*Rendimiento*Calidad
//Disponibilidad: (tiempoPlanificado-tiempoParo)/tiempoPlanificado
//tiempoPlanificado-tiempoParo = Tiempo Operativo
//Rendimiento: (Sumatoria de unidades producidas por producto)*(Tiempo estandar ponderado) / tiempo operativo
//Tiempo estandar ponderado: ((UnidadesProducto1*TiempoEstandarProducto1)+...+(UnidadesProductoN*TiempoEstandarProductoN))/(Sumatoria de unidades producidas por producto)
//Calidad: (UnidadesProducidas-UnidadesDefectuosas)/UnidadesProducidas

  @hasMany(() => Maquina, {through: {model: () => ProduccionMaquina}}) maquinas: Maquina[];
  @hasMany(() => Operario, {through: {model: () => ProduccionOperario}}) operarios: Operario[];
  @hasMany(() => Producto, {through: {model: () => DetalleProduccion}}) productos: Producto[];
  @belongsTo(() => Taller) tallerId: number;
  
  constructor(data?: Partial<Produccion>) {super(data);
  }
}

export interface ProduccionRelations {
  // describe navigational properties here
}

export type ProduccionWithRelations = Produccion & ProduccionRelations;
