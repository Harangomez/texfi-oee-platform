import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody, response} from '@loopback/rest';
import {Producto, Operacion} from '../models'; // ✅ Agregar Operacion
import {ProductoRepository} from '../repositories';
import {OperacionProductoRepository} from '../repositories'; // ✅ Agregar este repository
import {OperacionRepository} from '../repositories'; // ✅ Agregar este repository

export class ProductoController {
  constructor(
    @repository(ProductoRepository)
    public productoRepository: ProductoRepository,
    @repository(OperacionProductoRepository) // ✅ Inyectar el repository
    public operacionProductoRepository: OperacionProductoRepository,
    @repository(OperacionRepository) // ✅ Inyectar el repository
    public operacionRepository: OperacionRepository,
  ) {}

  @post('/productos')
  @response(200, {
    description: 'Producto model instance',
    content: {'application/json': {schema: getModelSchemaRef(Producto)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Producto, {
            title: 'NewProducto',
            exclude: ['id'],
          }),
        },
      },
    })
    producto: Omit<Producto, 'id'>,
  ): Promise<Producto> {
    return this.productoRepository.create(producto);
  }
  @get('/productos/count')
  @response(200, {
    description: 'Producto model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Producto) where?: Where<Producto>): Promise<Count> {
    return this.productoRepository.count(where);
  }
  @get('/productos')
  @response(200, {
    description: 'Array of Producto model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Producto, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Producto) filter?: Filter<Producto>): Promise<Producto[]> {
    return this.productoRepository.find(filter);
  }

  @get('/productos/{id}/operaciones')
  @response(200, {
    description: 'Operaciones del producto',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Operacion, {includeRelations: true}),
        },
      },
    },
  })
  async getOperaciones(
    @param.path.number('id') productoId: number,
  ): Promise<Operacion[]> {
    // 1. Buscar todas las relaciones operacion-producto para este producto
    const relaciones = await this.operacionProductoRepository.find({
      where: { productoId }
    });

    // 2. Extraer los IDs de las operaciones
    const operacionIds = relaciones.map(rel => rel.operacionId);

    // 3. Si no hay operaciones, retornar array vacío
    if (operacionIds.length === 0) {
      return [];
    }

    // 4. Buscar las operaciones completas usando los IDs
    const operaciones = await this.operacionRepository.find({
      where: { id: { inq: operacionIds } }
    });

    return operaciones;
  }

  @patch('/productos')
  @response(200, {
    description: 'Producto PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Producto, {partial: true}),
        },
      },
    })
    producto: Producto,
    @param.where(Producto) where?: Where<Producto>,
  ): Promise<Count> {
    return this.productoRepository.updateAll(producto, where);
  }
  @get('/productos/{id}')
  @response(200, {
    description: 'Producto model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Producto, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Producto, {exclude: 'where'}) filter?: FilterExcludingWhere<Producto>,
  ): Promise<Producto> {
    return this.productoRepository.findById(id, filter);
  }
  @patch('/productos/{id}')
  @response(204, {
    description: 'Producto PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Producto, {partial: true}),
        },
      },
    })
    producto: Producto,
  ): Promise<void> {
    await this.productoRepository.updateById(id, producto);
  }
  @put('/productos/{id}')
  @response(204, {
    description: 'Producto PUT success',
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() producto: Producto): Promise<void> {
    await this.productoRepository.replaceById(id, producto);
  }
  @del('/productos/{id}')
  @response(204, {
    description: 'Producto DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productoRepository.deleteById(id);
  }
}
