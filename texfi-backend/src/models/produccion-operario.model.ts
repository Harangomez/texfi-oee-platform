import {Entity, model, property} from '@loopback/repository';

@model()

export class ProduccionOperario extends Entity {
  
  @property({type: 'number', id: true, generated: true,}) id?: number;
  @property({type: 'number',}) produccionId?: number;
  @property({type: 'number',}) operarioId?: number;
  
  constructor(data?: Partial<ProduccionOperario>) {super(data);}
}

export interface ProduccionOperarioRelations {
  // describe navigational properties here
}

export type ProduccionOperarioWithRelations = ProduccionOperario & ProduccionOperarioRelations;
