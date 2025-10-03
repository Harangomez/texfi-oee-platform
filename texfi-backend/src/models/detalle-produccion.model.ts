import {Entity, model, property} from '@loopback/repository';

@model()

export class DetalleProduccion extends Entity {
  
  @property({type: 'number', id: true, generated: true}) id?: number;
  @property({type: 'number', required: true}) cantidadProducida: number;
  @property({type: 'number', required: true}) unidadesDefectuosas: number;
  @property({type: 'number'}) produccionId?: number;
  @property({type: 'number'}) productoId?: number;
  
  constructor(data?: Partial<DetalleProduccion>) {super(data);}
}

export interface DetalleProduccionRelations {
  // describe navigational properties here
}

export type DetalleProduccionWithRelations = DetalleProduccion & DetalleProduccionRelations;
