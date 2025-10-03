import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {OperacionProducto, OperacionProductoRelations} from '../models';

export class OperacionProductoRepository extends DefaultCrudRepository<
  OperacionProducto,
  typeof OperacionProducto.prototype.id,
  OperacionProductoRelations
> {
  constructor(@inject('datasources.postgresql') dataSource: PostgresqlDataSource) {
    super(OperacionProducto, dataSource);
  }
}
