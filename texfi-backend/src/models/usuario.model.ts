import {Entity, model, property, hasOne} from '@loopback/repository';
import {Cliente} from './cliente.model';
import {Taller} from './taller.model';

@model()

export class Usuario extends Entity {
  
  @property({type: 'number', id: true, generated: true}) id?: number;
  @property({type: 'string', required: true}) nombre: string;
  @property({type: 'string', required: true, jsonSchema: {minLength: 6}}) password: string;
  @property({type: 'string', required: true, jsonSchema: {enum: ['taller', 'cliente', 'admin']}}) rol: string;
  @property({type: 'string', required: true, jsonSchema: {enum: ['gratuito', 'premium', 'empresa']}}) plan: string;
  @property({type: 'date'}) fechaVencimientoPlan?: Date; //Cambio de string por Date
  @property({type: 'object'}) caracteristicas?: object;
  @property({type: 'boolean', required: true}) activo: boolean;
  @property({type: 'date', default: '$now'}) fechaCreacion?: Date; //Cambio de string por Date-required por default - true por $now
  @property({type: 'date', default: '$now'}) fechaActualizacion?: Date; //Cambio de string por Date-required por default - true por $now
    
  //@hasOne(() => Cliente) cliente: Cliente;
  //@hasOne(() => Taller) taller: Taller;

  @hasOne(() => Cliente, {keyTo: 'usuarioId'})
  cliente: Cliente;

  @hasOne(() => Taller, {keyTo: 'usuarioId'})
  taller: Taller;
  
  constructor(data?: Partial<Usuario>) {super(data);}
}

export interface UsuarioRelations {
  // describe navigational properties here
}

export type UsuarioWithRelations = Usuario & UsuarioRelations;
