import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody, response} from '@loopback/rest';
import {Taller} from '../models';
import {TallerRepository} from '../repositories';

export class TallerController {
  constructor(
    @repository(TallerRepository)
    public tallerRepository: TallerRepository,
  ) {}
  @post('/talleres')
  @response(200, {
    description: 'Taller model instance',
    content: {'application/json': {schema: getModelSchemaRef(Taller)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Taller, {
            title: 'NewTaller',
            exclude: ['id'],
          }),
        },
      },
    })
    taller: Omit<Taller, 'id'>,
  ): Promise<Taller> {
    return this.tallerRepository.create(taller);
  }
  @get('/talleres/count')
  @response(200, {
    description: 'Taller model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Taller) where?: Where<Taller>): Promise<Count> {
    return this.tallerRepository.count(where);
  }
  @get('/talleres')
  @response(200, {
    description: 'Array of Taller model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Taller, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Taller) filter?: Filter<Taller>): Promise<Taller[]> {
    return this.tallerRepository.find(filter);
  }
  @patch('/talleres')
  @response(200, {
    description: 'Taller PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Taller, {partial: true}),
        },
      },
    })
    taller: Taller,
    @param.where(Taller) where?: Where<Taller>,
  ): Promise<Count> {
    return this.tallerRepository.updateAll(taller, where);
  }
  @get('/talleres/{id}')
  @response(200, {
    description: 'Taller model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Taller, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Taller, {exclude: 'where'}) filter?: FilterExcludingWhere<Taller>,
  ): Promise<Taller> {
    return this.tallerRepository.findById(id, filter);
  }
  @patch('/talleres/{id}')
  @response(204, {
    description: 'Taller PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Taller, {partial: true}),
        },
      },
    })
    taller: Taller,
  ): Promise<void> {
    await this.tallerRepository.updateById(id, taller);
  }
  @put('/talleres/{id}')
  @response(204, {
    description: 'Taller PUT success',
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() taller: Taller): Promise<void> {
    await this.tallerRepository.replaceById(id, taller);
  }
  @del('/talleres/{id}')
  @response(204, {
    description: 'Taller DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tallerRepository.deleteById(id);
  }
}
