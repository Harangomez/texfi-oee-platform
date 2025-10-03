import {Count, CountSchema, Filter, FilterExcludingWhere, repository, Where} from '@loopback/repository';
import {post, param, get, getModelSchemaRef, patch, put, del, requestBody, response} from '@loopback/rest';
import {TallerCliente} from '../models';
import {TallerClienteRepository} from '../repositories';

export class TallerClienteController {
  constructor(
    @repository(TallerClienteRepository)
    public tallerClienteRepository: TallerClienteRepository,
  ) {}
  @post('/taller-clientes')
  @response(200, {
    description: 'TallerCliente model instance',
    content: {'application/json': {schema: getModelSchemaRef(TallerCliente)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TallerCliente, {
            title: 'NewTallerCliente',
            exclude: ['id'],
          }),
        },
      },
    })
    tallerCliente: Omit<TallerCliente, 'id'>,
  ): Promise<TallerCliente> {
    return this.tallerClienteRepository.create(tallerCliente);
  }
  @get('/taller-clientes/count')
  @response(200, {
    description: 'TallerCliente model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(TallerCliente) where?: Where<TallerCliente>): Promise<Count> {
    return this.tallerClienteRepository.count(where);
  }
  @get('/taller-clientes')
  @response(200, {
    description: 'Array of TallerCliente model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TallerCliente, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(TallerCliente) filter?: Filter<TallerCliente>): Promise<TallerCliente[]> {
    return this.tallerClienteRepository.find(filter);
  }
  @patch('/taller-clientes')
  @response(200, {
    description: 'TallerCliente PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TallerCliente, {partial: true}),
        },
      },
    })
    tallerCliente: TallerCliente,
    @param.where(TallerCliente) where?: Where<TallerCliente>,
  ): Promise<Count> {
    return this.tallerClienteRepository.updateAll(tallerCliente, where);
  }
  @get('/taller-clientes/{id}')
  @response(200, {
    description: 'TallerCliente model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TallerCliente, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TallerCliente, {exclude: 'where'}) filter?: FilterExcludingWhere<TallerCliente>,
  ): Promise<TallerCliente> {
    return this.tallerClienteRepository.findById(id, filter);
  }
  @patch('/taller-clientes/{id}')
  @response(204, {
    description: 'TallerCliente PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TallerCliente, {partial: true}),
        },
      },
    })
    tallerCliente: TallerCliente,
  ): Promise<void> {
    await this.tallerClienteRepository.updateById(id, tallerCliente);
  }
  @put('/taller-clientes/{id}')
  @response(204, {
    description: 'TallerCliente PUT success',
  })
  async replaceById(@param.path.number('id') id: number, @requestBody() tallerCliente: TallerCliente): Promise<void> {
    await this.tallerClienteRepository.replaceById(id, tallerCliente);
  }
  @del('/taller-clientes/{id}')
  @response(204, {
    description: 'TallerCliente DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.tallerClienteRepository.deleteById(id);
  }
}
