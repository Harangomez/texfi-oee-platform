import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {DetalleProduccion, DetalleProduccionRelations} from '../models';

export class DetalleProduccionRepository extends DefaultCrudRepository<
  DetalleProduccion,
  typeof DetalleProduccion.prototype.id,
  DetalleProduccionRelations
> {
  constructor(@inject('datasources.postgresql') dataSource: PostgresqlDataSource) {
    super(DetalleProduccion, dataSource);
  }
}
