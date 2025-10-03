import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {Taller, TallerRelations} from '../models';

export class TallerRepository extends DefaultCrudRepository<Taller, typeof Taller.prototype.id, TallerRelations> {
  constructor(@inject('datasources.postgresql') dataSource: PostgresqlDataSource) {
    super(Taller, dataSource);
  }
}
