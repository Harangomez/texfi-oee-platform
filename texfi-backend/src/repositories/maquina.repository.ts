import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {Maquina, MaquinaRelations} from '../models';

export class MaquinaRepository extends DefaultCrudRepository<Maquina, typeof Maquina.prototype.id, MaquinaRelations> {
  constructor(@inject('datasources.postgresql') dataSource: PostgresqlDataSource) {
    super(Maquina, dataSource);
  }
}
