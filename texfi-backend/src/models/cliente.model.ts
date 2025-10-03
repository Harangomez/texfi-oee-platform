import {Entity, model, property, hasMany, belongsTo} from '@loopback/repository';
import {Taller} from './taller.model';
import {TallerCliente} from './taller-cliente.model';
import {Producto} from './producto.model';
import {Usuario} from './usuario.model';

@model()

export class Cliente extends Entity {
  
  @property({type: 'number', id: true, generated: true}) id?: number;
  @property({type: 'string', required: true}) pais: string;
  @property({type: 'string', required: true}) nombre: string;
  @property({type: 'string', required: true}) identificacion: string;
  @property({type: 'string', required: true}) contacto: string;
  @property({type: 'string', required: true, jsonSchema: {format: 'email'}}) email: string;
  @property({type: 'string', required: true}) telefono: string;
    
  @hasMany(() => Taller, {through: {model: () => TallerCliente}}) talleres: Taller[];
  @hasMany(() => Producto) productos: Producto[];
  @belongsTo(() => Usuario) usuarioId: number;
  
  constructor(data?: Partial<Cliente>) {super(data);}
}

export interface ClienteRelations {
  // describe navigational properties here
}

export type ClienteWithRelations = Cliente & ClienteRelations;
