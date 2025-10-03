import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where,} from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody, response,} from '@loopback/rest';
import {ProduccionOperario} from '../models';
import {ProduccionOperarioRepository} from '../repositories';

export class ProduccionOperarioController {
  constructor(
    @repository(ProduccionOperarioRepository)
    public produccionOperarioRepository : ProduccionOperarioRepository,
  ) {}

  @post('/produccion-operarios')
  @response(200, {
    description: 'ProduccionOperario model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProduccionOperario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProduccionOperario, {
            title: 'NewProduccionOperario',
            exclude: ['id'],
          }),
        },
      },
    })
    produccionOperario: Omit<ProduccionOperario, 'id'>,
  ): Promise<ProduccionOperario> {
    return this.produccionOperarioRepository.create(produccionOperario);
  }

  @get('/produccion-operarios/count')
  @response(200, {
    description: 'ProduccionOperario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProduccionOperario) where?: Where<ProduccionOperario>,
  ): Promise<Count> {
    return this.produccionOperarioRepository.count(where);
  }

  @get('/produccion-operarios')
  @response(200, {
    description: 'Array of ProduccionOperario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProduccionOperario, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProduccionOperario) filter?: Filter<ProduccionOperario>,
  ): Promise<ProduccionOperario[]> {
    return this.produccionOperarioRepository.find(filter);
  }

  @patch('/produccion-operarios')
  @response(200, {
    description: 'ProduccionOperario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProduccionOperario, {partial: true}),
        },
      },
    })
    produccionOperario: ProduccionOperario,
    @param.where(ProduccionOperario) where?: Where<ProduccionOperario>,
  ): Promise<Count> {
    return this.produccionOperarioRepository.updateAll(produccionOperario, where);
  }

  @get('/produccion-operarios/{id}')
  @response(200, {
    description: 'ProduccionOperario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProduccionOperario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProduccionOperario, {exclude: 'where'}) filter?: FilterExcludingWhere<ProduccionOperario>
  ): Promise<ProduccionOperario> {
    return this.produccionOperarioRepository.findById(id, filter);
  }

  @patch('/produccion-operarios/{id}')
  @response(204, {
    description: 'ProduccionOperario PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProduccionOperario, {partial: true}),
        },
      },
    })
    produccionOperario: ProduccionOperario,
  ): Promise<void> {
    await this.produccionOperarioRepository.updateById(id, produccionOperario);
  }

  @put('/produccion-operarios/{id}')
  @response(204, {
    description: 'ProduccionOperario PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() produccionOperario: ProduccionOperario,
  ): Promise<void> {
    await this.produccionOperarioRepository.replaceById(id, produccionOperario);
  }

  @del('/produccion-operarios/{id}')
  @response(204, {
    description: 'ProduccionOperario DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.produccionOperarioRepository.deleteById(id);
  }
}
