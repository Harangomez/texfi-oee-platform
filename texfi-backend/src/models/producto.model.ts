import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Cliente} from './cliente.model';
import {Taller} from './taller.model';
import {Operacion} from './operacion.model';
import {OperacionProducto} from './operacion-producto.model';
import {Produccion} from './produccion.model';
import {DetalleProduccion} from './detalle-produccion.model';

@model()

export class Producto extends Entity {
  
  @property({type: 'number', id: true, generated: true,}) id?: number;
  @property({type: 'string', required: true,}) referencia: string;
  @property({type: 'string',}) descripcion?: string;
  @property({type: 'number',}) tiempoEstandar: number;
  
  @belongsTo(() => Taller) tallerId: number;
  @belongsTo(() => Cliente) clienteId: number;
  @hasMany(() => Operacion, {through: {model: () => OperacionProducto}}) operaciones: Operacion[];
  @hasMany(() => Produccion, {through: {model: () => DetalleProduccion}}) producciones: Produccion[];
  
  constructor(data?: Partial<Producto>) {super(data);}
}

export interface ProductoRelations {
  // describe navigational properties here
}

export type ProductoWithRelations = Producto & ProductoRelations;
