import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {Operario, OperarioRelations} from '../models';

export class OperarioRepository extends DefaultCrudRepository<Operario, typeof Operario.prototype.id, OperarioRelations> {
  constructor(@inject('datasources.postgresql') dataSource: PostgresqlDataSource) {
    super(Operario, dataSource);
  }
}
