import {Entity, model, property, belongsTo, hasMany} from '@loopback/repository';
import {Taller} from './taller.model';
import {Produccion} from './produccion.model';
import {ProduccionMaquina} from './produccion-maquina.model';

@model()

export class Maquina extends Entity {
  
  @property({type: 'number', id: true, generated: true,}) id?: number;
  @property({type: 'string', required: true,}) nombre: string;
  @property({type: 'string', required: true,}) tipo: string;
  @property({type: 'boolean', default: true,}) activo?: boolean;
  
  @belongsTo(() => Taller) tallerId: number;
  @hasMany(() => Produccion, {through: {model: () => ProduccionMaquina}}) producciones: Produccion[];
  
  constructor(data?: Partial<Maquina>) {super(data);}
}

export interface MaquinaRelations {
  // describe navigational properties here
}

export type MaquinaWithRelations = Maquina & MaquinaRelations;
