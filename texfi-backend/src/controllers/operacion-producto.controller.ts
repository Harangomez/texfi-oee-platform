import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody, response} from '@loopback/rest';
import {OperacionProducto} from '../models';
import {OperacionProductoRepository} from '../repositories';

export class OperacionProductoController {
  constructor(
    @repository(OperacionProductoRepository)
    public operacionProductoRepository: OperacionProductoRepository,
  ) {}
  @post('/operaciones-producto')
  @response(200, {
    description: 'OperacionProducto model instance',
    content: {'application/json': {schema: getModelSchemaRef(OperacionProducto)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OperacionProducto, {
            title: 'NewOperacionProducto',
            exclude: ['id'],
          }),
        },
      },
    })
    operacionProducto: Omit<OperacionProducto, 'id'>,
  ): Promise<OperacionProducto> {
    return this.operacionProductoRepository.create(operacionProducto);
  }
  @get('/operaciones-producto/count')
  @response(200, {
    description: 'OperacionProducto model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(OperacionProducto) where?: Where<OperacionProducto>): Promise<Count> {
    return this.operacionProductoRepository.count(where);
  }
  @get('/operaciones-producto')
  @response(200, {
    description: 'Array of OperacionProducto model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(OperacionProducto, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(OperacionProducto) filter?: Filter<OperacionProducto>): Promise<OperacionProducto[]> {
    return this.operacionProductoRepository.find(filter);
  }
  @patch('/operaciones-producto')
  @response(200, {
    description: 'OperacionProducto PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OperacionProducto, {partial: true}),
        },
      },
    })
    operacionProducto: OperacionProducto,
    @param.where(OperacionProducto) where?: Where<OperacionProducto>,
  ): Promise<Count> {
    return this.operacionProductoRepository.updateAll(operacionProducto, where);
  }
  @get('/operaciones-producto/{id}')
  @response(200, {
    description: 'OperacionProducto model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(OperacionProducto, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(OperacionProducto, {exclude: 'where'}) filter?: FilterExcludingWhere<OperacionProducto>,
  ): Promise<OperacionProducto> {
    return this.operacionProductoRepository.findById(id, filter);
  }
  @patch('/operaciones-producto/{id}')
  @response(204, {
    description: 'OperacionProducto PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(OperacionProducto, {partial: true}),
        },
      },
    })
    operacionProducto: OperacionProducto,
  ): Promise<void> {
    await this.operacionProductoRepository.updateById(id, operacionProducto);
  }
  @put('/operaciones-producto/{id}')
  @response(204, {
    description: 'OperacionProducto PUT success',
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() operacionProducto: OperacionProducto): Promise<void> {
    await this.operacionProductoRepository.replaceById(id, operacionProducto);
  }
  @del('/operaciones-producto/{id}')
  @response(204, {
    description: 'OperacionProducto DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.operacionProductoRepository.deleteById(id);
  }
}
