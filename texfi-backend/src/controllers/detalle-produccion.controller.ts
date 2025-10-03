import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody, response} from '@loopback/rest';
import {DetalleProduccion} from '../models';
import {DetalleProduccionRepository} from '../repositories';

export class DetalleProduccionController {
  constructor(
    @repository(DetalleProduccionRepository)
    public detalleProduccionRepository: DetalleProduccionRepository,
  ) {}
  @post('/detalles-produccion')
  @response(200, {
    description: 'DetalleProduccion model instance',
    content: {'application/json': {schema: getModelSchemaRef(DetalleProduccion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DetalleProduccion, {
            title: 'NewDetalleProduccion',
            exclude: ['id'],
          }),
        },
      },
    })
    detalleProduccion: Omit<DetalleProduccion, 'id'>,
  ): Promise<DetalleProduccion> {
    return this.detalleProduccionRepository.create(detalleProduccion);
  }
  @get('/detalles-produccion/count')
  @response(200, {
    description: 'DetalleProduccion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(DetalleProduccion) where?: Where<DetalleProduccion>): Promise<Count> {
    return this.detalleProduccionRepository.count(where);
  }
  @get('/detalles-produccion')
  @response(200, {
    description: 'Array of DetalleProduccion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(DetalleProduccion, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(DetalleProduccion) filter?: Filter<DetalleProduccion>): Promise<DetalleProduccion[]> {
    return this.detalleProduccionRepository.find(filter);
  }
  @patch('/detalles-produccion')
  @response(200, {
    description: 'DetalleProduccion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DetalleProduccion, {partial: true}),
        },
      },
    })
    detalleProduccion: DetalleProduccion,
    @param.where(DetalleProduccion) where?: Where<DetalleProduccion>,
  ): Promise<Count> {
    return this.detalleProduccionRepository.updateAll(detalleProduccion, where);
  }
  @get('/detalles-produccion/{id}')
  @response(200, {
    description: 'DetalleProduccion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(DetalleProduccion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(DetalleProduccion, {exclude: 'where'}) filter?: FilterExcludingWhere<DetalleProduccion>,
  ): Promise<DetalleProduccion> {
    return this.detalleProduccionRepository.findById(id, filter);
  }
  @patch('/detalles-produccion/{id}')
  @response(204, {
    description: 'DetalleProduccion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DetalleProduccion, {partial: true}),
        },
      },
    })
    detalleProduccion: DetalleProduccion,
  ): Promise<void> {
    await this.detalleProduccionRepository.updateById(id, detalleProduccion);
  }
  @put('/detalles-produccion/{id}')
  @response(204, {
    description: 'DetalleProduccion PUT success',
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() detalleProduccion: DetalleProduccion): Promise<void> {
    await this.detalleProduccionRepository.replaceById(id, detalleProduccion);
  }
  @del('/detalles-produccion/{id}')
  @response(204, {
    description: 'DetalleProduccion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.detalleProduccionRepository.deleteById(id);
  }
}
