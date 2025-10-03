import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {ProduccionOperario, ProduccionOperarioRelations} from '../models';

export class ProduccionOperarioRepository extends DefaultCrudRepository<
  ProduccionOperario,
  typeof ProduccionOperario.prototype.id,
  ProduccionOperarioRelations
> {
  constructor(@inject('datasources.postgresql') dataSource: PostgresqlDataSource) {
    super(ProduccionOperario, dataSource);
  }
}
