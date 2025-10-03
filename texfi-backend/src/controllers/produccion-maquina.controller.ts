import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody, response} from '@loopback/rest';
import {ProduccionMaquina} from '../models';
import {ProduccionMaquinaRepository} from '../repositories';

export class ProduccionMaquinaController {
  constructor(
    @repository(ProduccionMaquinaRepository)
    public produccionMaquinaRepository: ProduccionMaquinaRepository,
  ) {}
  
  @post('/produccion-maquinas')
  @response(200, {
    description: 'ProduccionMaquina model instance',
    content: {'application/json': {schema: getModelSchemaRef(ProduccionMaquina)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProduccionMaquina, {
            title: 'NewProduccionMaquina',
            exclude: ['id'],
          }),
        },
      },
    })
    produccionMaquina: Omit<ProduccionMaquina, 'id'>,
  ): Promise<ProduccionMaquina> {
    return this.produccionMaquinaRepository.create(produccionMaquina);
  }

  @get('/produccion-maquinas/count')
  @response(200, {
    description: 'ProduccionMaquina model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(ProduccionMaquina) where?: Where<ProduccionMaquina>
  ): Promise<Count> {
    return this.produccionMaquinaRepository.count(where);
  }

  @get('/produccion-maquinas')
  @response(200, {
    description: 'Array of ProduccionMaquina model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(ProduccionMaquina, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(ProduccionMaquina) filter?: Filter<ProduccionMaquina>
  ): Promise<ProduccionMaquina[]> {
    return this.produccionMaquinaRepository.find(filter);
  }

  @patch('/produccion-maquinas')
  @response(200, {
    description: 'ProduccionMaquina PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProduccionMaquina, {partial: true}),
        },
      },
    })
    produccionMaquina: ProduccionMaquina,
    @param.where(ProduccionMaquina) where?: Where<ProduccionMaquina>,
  ): Promise<Count> {
    return this.produccionMaquinaRepository.updateAll(produccionMaquina, where);
  }
  
  @get('/produccion-maquinas/{id}')
  @response(200, {
    description: 'ProduccionMaquina model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(ProduccionMaquina, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(ProduccionMaquina, {exclude: 'where'}) filter?: FilterExcludingWhere<ProduccionMaquina>,
  ): Promise<ProduccionMaquina> {
    return this.produccionMaquinaRepository.findById(id, filter);
  }

  @patch('/produccion-maquinas/{id}')
  @response(204, {
    description: 'ProduccionMaquina PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(ProduccionMaquina, {partial: true}),
        },
      },
    })
    produccionMaquina: ProduccionMaquina,
  ): Promise<void> {
    await this.produccionMaquinaRepository.updateById(id, produccionMaquina);
  }

  @put('/produccion-maquinas/{id}')
  @response(204, {
    description: 'ProduccionMaquina PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number, 
    @requestBody() produccionMaquina: ProduccionMaquina
  ): Promise<void> {
    await this.produccionMaquinaRepository.replaceById(id, produccionMaquina);
  }
  
  @del('/produccion-maquinas/{id}')
  @response(204, {
    description: 'ProduccionMaquina DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.produccionMaquinaRepository.deleteById(id);
  }
}
