import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody, response} from '@loopback/rest';
import {Operario} from '../models';
import {OperarioRepository} from '../repositories';

export class OperarioController {
  constructor(
    @repository(OperarioRepository)
    public operarioRepository: OperarioRepository,
  ) {}
  @post('/operarios')
  @response(200, {
    description: 'Operario model instance',
    content: {'application/json': {schema: getModelSchemaRef(Operario)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Operario, {
            title: 'NewOperario',
            exclude: ['id'],
          }),
        },
      },
    })
    operario: Omit<Operario, 'id'>,
  ): Promise<Operario> {
    return this.operarioRepository.create(operario);
  }
  @get('/operarios/count')
  @response(200, {
    description: 'Operario model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Operario) where?: Where<Operario>): Promise<Count> {
    return this.operarioRepository.count(where);
  }
  @get('/operarios')
  @response(200, {
    description: 'Array of Operario model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Operario, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Operario) filter?: Filter<Operario>): Promise<Operario[]> {
    return this.operarioRepository.find(filter);
  }
  @patch('/operarios')
  @response(200, {
    description: 'Operario PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Operario, {partial: true}),
        },
      },
    })
    operario: Operario,
    @param.where(Operario) where?: Where<Operario>,
  ): Promise<Count> {
    return this.operarioRepository.updateAll(operario, where);
  }
  @get('/operarios/{id}')
  @response(200, {
    description: 'Operario model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Operario, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Operario, {exclude: 'where'}) filter?: FilterExcludingWhere<Operario>,
  ): Promise<Operario> {
    return this.operarioRepository.findById(id, filter);
  }
  @patch('/operarios/{id}')
  @response(204, {
    description: 'Operario PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Operario, {partial: true}),
        },
      },
    })
    operario: Operario,
  ): Promise<void> {
    await this.operarioRepository.updateById(id, operario);
  }
  @put('/operarios/{id}')
  @response(204, {
    description: 'Operario PUT success',
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() operario: Operario): Promise<void> {
    await this.operarioRepository.replaceById(id, operario);
  }
  @del('/operarios/{id}')
  @response(204, {
    description: 'Operario DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.operarioRepository.deleteById(id);
  }
}
