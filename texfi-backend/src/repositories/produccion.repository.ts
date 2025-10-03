import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {Produccion, ProduccionRelations} from '../models';

export class ProduccionRepository extends DefaultCrudRepository<Produccion, typeof Produccion.prototype.id, ProduccionRelations> {
  constructor(@inject('datasources.postgresql') dataSource: PostgresqlDataSource) {
    super(Produccion, dataSource);
  }
}
