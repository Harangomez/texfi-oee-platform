/*import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {Producto, ProductoRelations} from '../models';

export class ProductoRepository extends DefaultCrudRepository<Producto, typeof Producto.prototype.id, ProductoRelations> {
  constructor(@inject('datasources.postgresql') dataSource: PostgresqlDataSource) {
    super(Producto, dataSource);
  }
}*/

//Si la modificacion no funciona reactivar este codigo y desactivar el siguiente

import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {PostgresqlDataSource} from '../datasources';
import {Producto, ProductoRelations, Cliente} from '../models';
import {ClienteRepository} from './cliente.repository';

export class ProductoRepository extends DefaultCrudRepository<Producto, typeof Producto.prototype.id, ProductoRelations> {
  public readonly cliente: BelongsToAccessor<Cliente, typeof Producto.prototype.id>;

  constructor(
    @inject('datasources.postgresql') dataSource: PostgresqlDataSource,
    @repository.getter('ClienteRepository')
    protected clienteRepositoryGetter: Getter<ClienteRepository>,
  ) {
    super(Producto, dataSource);
    this.cliente = this.createBelongsToAccessorFor('cliente', clienteRepositoryGetter);
    this.registerInclusionResolver('cliente', this.cliente.inclusionResolver);
  }
}

//Solución tentativa para llamar a los clientes por nombre en el listado de productos
