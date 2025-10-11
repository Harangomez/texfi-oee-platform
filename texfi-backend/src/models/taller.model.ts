import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Maquina} from './maquina.model';
import {Operario} from './operario.model';
import {Produccion} from './produccion.model';
import {Usuario} from './usuario.model';
import {Producto} from './producto.model';

@model()

export class Taller extends Entity {
  
  @property({type: 'number', id: true, generated: true}) id?: number;
  @property({type: 'string', required: true}) pais: string;
  @property({type: 'string', required: true}) nombre: string;
  @property({type: 'string', required: true}) identificacion: string;
  @property({type: 'string', required: true, jsonSchema: {format: 'email'}}) email: string;
  @property({type: 'string', required: true}) telefono: string;
  
  @hasMany(() => Maquina) maquinas: Maquina[];
  @hasMany(() => Operario) operarios: Operario[];
  @hasMany(() => Producto) productos: Producto[];
  @hasMany(() => Produccion) producciones: Produccion[];
  @belongsTo(() => Usuario) usuarioId: number; 
  
  constructor(data?: Partial<Taller>) {super(data);}
}

export interface TallerRelations {
  // describe navigational properties here
}

export type TallerWithRelations = Taller & TallerRelations;
