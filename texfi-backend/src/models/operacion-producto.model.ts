import {Entity, model, property} from '@loopback/repository';

@model()

export class OperacionProducto extends Entity {
 
  @property({type: 'number', id: true, generated: true,}) id?: number;
  @property({type: 'number', required: true,}) productoId: number;
  @property({type: 'number', required: true,}) operacionId: number;
  
  constructor(data?: Partial<OperacionProducto>) {super(data);}
}

export interface OperacionProductoRelations {
  // describe navigational properties here
}

export type OperacionProductoWithRelations = OperacionProducto & OperacionProductoRelations;
