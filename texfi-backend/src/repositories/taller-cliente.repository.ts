import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {TallerCliente, TallerClienteRelations} from '../models';

export class TallerClienteRepository extends DefaultCrudRepository<
  TallerCliente,
  typeof TallerCliente.prototype.id,
  TallerClienteRelations
> {
  constructor(@inject('datasources.postgresql') dataSource: PostgresqlDataSource) {
    super(TallerCliente, dataSource);
  }
}
