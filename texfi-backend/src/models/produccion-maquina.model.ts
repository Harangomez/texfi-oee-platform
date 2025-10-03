import {Entity, model, property} from '@loopback/repository';

@model()

export class ProduccionMaquina extends Entity {
  
  @property({type: 'number', id: true, generated: true,}) id?: number;
  @property({type: 'number',}) produccionId?: number;
  @property({type: 'number',}) maquinaId?: number;
  
  constructor(data?: Partial<ProduccionMaquina>) {super(data);}
}

export interface ProduccionMaquinaRelations {
  // describe navigational properties here
}

export type ProduccionMaquinaWithRelations = ProduccionMaquina & ProduccionMaquinaRelations;
