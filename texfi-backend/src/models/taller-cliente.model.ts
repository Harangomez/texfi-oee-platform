import {Entity, model, property} from '@loopback/repository';

@model()

export class TallerCliente extends Entity {
  
  @property({type: 'number', id: true, generated: true,}) id?: number;
  @property({type: 'number',}) tallerId?: number;
  @property({type: 'number',}) clienteId?: number;
  
  constructor(data?: Partial<TallerCliente>) {super(data);}
}

export interface TallerClienteRelations {
  // describe navigational properties here
}

export type TallerClienteWithRelations = TallerCliente & TallerClienteRelations;
