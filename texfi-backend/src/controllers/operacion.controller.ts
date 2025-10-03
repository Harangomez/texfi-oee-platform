import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody, response} from '@loopback/rest';
import {Operacion} from '../models';
import {OperacionRepository} from '../repositories';

export class OperacionController {
  constructor(
    @repository(OperacionRepository)
    public operacionRepository: OperacionRepository,
  ) {}
  @post('/operaciones')
  @response(200, {
    description: 'Operacion model instance',
    content: {'application/json': {schema: getModelSchemaRef(Operacion)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Operacion, {
            title: 'NewOperacion',
            exclude: ['id'],
          }),
        },
      },
    })
    operacion: Omit<Operacion, 'id'>,
  ): Promise<Operacion> {
    return this.operacionRepository.create(operacion);
  }
  @get('/operaciones/count')
  @response(200, {
    description: 'Operacion model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Operacion) where?: Where<Operacion>): Promise<Count> {
    return this.operacionRepository.count(where);
  }
  @get('/operaciones')
  @response(200, {
    description: 'Array of Operacion model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Operacion, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Operacion) filter?: Filter<Operacion>): Promise<Operacion[]> {
    return this.operacionRepository.find(filter);
  }
  @patch('/operaciones')
  @response(200, {
    description: 'Operacion PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Operacion, {partial: true}),
        },
      },
    })
    operacion: Operacion,
    @param.where(Operacion) where?: Where<Operacion>,
  ): Promise<Count> {
    return this.operacionRepository.updateAll(operacion, where);
  }
  @get('/operaciones/{id}')
  @response(200, {
    description: 'Operacion model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Operacion, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Operacion, {exclude: 'where'}) filter?: FilterExcludingWhere<Operacion>,
  ): Promise<Operacion> {
    return this.operacionRepository.findById(id, filter);
  }
  @patch('/operaciones/{id}')
  @response(204, {
    description: 'Operacion PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Operacion, {partial: true}),
        },
      },
    })
    operacion: Operacion,
  ): Promise<void> {
    await this.operacionRepository.updateById(id, operacion);
  }
  @put('/operaciones/{id}')
  @response(204, {
    description: 'Operacion PUT success',
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() operacion: Operacion): Promise<void> {
    await this.operacionRepository.replaceById(id, operacion);
  }
  @del('/operaciones/{id}')
  @response(204, {
    description: 'Operacion DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.operacionRepository.deleteById(id);
  }
}
