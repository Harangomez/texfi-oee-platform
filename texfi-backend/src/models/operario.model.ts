import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Taller} from './taller.model';
import {Produccion} from './produccion.model';
import {ProduccionOperario} from './produccion-operario.model';

@model()

export class Operario extends Entity {
  
  @property({type: 'number', id: true, generated: true,}) id?: number;
  @property({type: 'string', required: true,}) nombre: string;
  @property({type: 'string', required: true,}) identificacion: string;
  @property({type: 'boolean', default: true,}) activo?: boolean;
  
  @belongsTo(() => Taller) tallerId: number;
  @hasMany(() => Produccion, {through: {model: () => ProduccionOperario}}) producciones: Produccion[];
  
  constructor(data?: Partial<Operario>) {super(data);}
}

export interface OperarioRelations {
  // describe navigational properties here
}

export type OperarioWithRelations = Operario & OperarioRelations;
