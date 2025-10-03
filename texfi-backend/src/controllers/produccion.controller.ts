import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody, response} from '@loopback/rest';
import {Produccion} from '../models';
import {ProduccionRepository} from '../repositories';

export class ProduccionController {
  constructor(
    @repository(ProduccionRepository)
    public produccionRepository: ProduccionRepository,
  ) {}
  @post('/producciones')
  @response(200, {
    description: 'Produccion model instance',
    content: {'application/json': {schema: getModelSchemaRef(Produccion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Produccion, {
            title: 'NewProduccion',
            exclude: ['id'],
          }),
        },
      },
    })
    produccion: Omit<Produccion, 'id'>,
  ): Promise<Produccion> {
    return this.produccionRepository.create(produccion);
  }
  @get('/producciones/count')
  @response(200, {
    description: 'Produccion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Produccion) where?: Where<Produccion>): Promise<Count> {
    return this.produccionRepository.count(where);
  }
  @get('/producciones')
  @response(200, {
    description: 'Array of Produccion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Produccion, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Produccion) filter?: Filter<Produccion>): Promise<Produccion[]> {
    return this.produccionRepository.find(filter);
  }
  @patch('/producciones')
  @response(200, {
    description: 'Produccion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Produccion, {partial: true}),
        },
      },
    })
    produccion: Produccion,
    @param.where(Produccion) where?: Where<Produccion>,
  ): Promise<Count> {
    return this.produccionRepository.updateAll(produccion, where);
  }
  @get('/producciones/{id}')
  @response(200, {
    description: 'Produccion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Produccion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Produccion, {exclude: 'where'}) filter?: FilterExcludingWhere<Produccion>,
  ): Promise<Produccion> {
    return this.produccionRepository.findById(id, filter);
  }
  @patch('/producciones/{id}')
  @response(204, {
    description: 'Produccion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Produccion, {partial: true}),
        },
      },
    })
    produccion: Produccion,
  ): Promise<void> {
    await this.produccionRepository.updateById(id, produccion);
  }
  @put('/producciones/{id}')
  @response(204, {
    description: 'Produccion PUT success',
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() produccion: Produccion): Promise<void> {
    await this.produccionRepository.replaceById(id, produccion);
  }
  @del('/producciones/{id}')
  @response(204, {
    description: 'Produccion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.produccionRepository.deleteById(id);
  }
}
