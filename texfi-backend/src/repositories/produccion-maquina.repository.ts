import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {ProduccionMaquina, ProduccionMaquinaRelations} from '../models';

export class ProduccionMaquinaRepository extends DefaultCrudRepository<
  ProduccionMaquina,
  typeof ProduccionMaquina.prototype.id,
  ProduccionMaquinaRelations
> {
  constructor(@inject('datasources.postgresql') dataSource: PostgresqlDataSource) {
    super(ProduccionMaquina, dataSource);
  }
}
