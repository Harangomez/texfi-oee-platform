import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {Operacion, OperacionRelations} from '../models';

export class OperacionRepository extends DefaultCrudRepository<Operacion, typeof Operacion.prototype.id, OperacionRelations> {
  constructor(@inject('datasources.postgresql') dataSource: PostgresqlDataSource) {
    super(Operacion, dataSource);
  }
}
