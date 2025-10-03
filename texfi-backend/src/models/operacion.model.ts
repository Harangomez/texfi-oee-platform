import {Entity, model, property, hasMany} from '@loopback/repository';
import {Producto} from './producto.model';
import {OperacionProducto} from './operacion-producto.model';

@model()

export class Operacion extends Entity {
  
  @property({type: 'number', id: true, generated: true,}) id?: number;
  @property({type: 'string', required: true,}) nombre: string;
  
  @hasMany(() => Producto, {through: {model: () => OperacionProducto}}) productos: Producto[];
  
  constructor(data?: Partial<Operacion>) {super(data);}
}

export interface OperacionRelations {
  // describe navigational properties here
}

export type OperacionWithRelations = Operacion & OperacionRelations;
