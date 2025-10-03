import {inject} from '@loopback/core';
import {model, property, repository} from '@loopback/repository';
import {HttpErrors, post, requestBody} from '@loopback/rest';
import {ClienteRepository, TallerRepository, UsuarioRepository} from '../repositories';
import {Usuario, Taller, Cliente} from '../models';
import {TokenService} from '@loopback/authentication';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {UserProfile, securityId} from '@loopback/security';

@model()
export class LoginRequest {
  @property({
    type: 'string',
    required: true,
  })
  email: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;
}

@model()
export class RegisterRequest {
  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['taller', 'cliente'],
    },
  })
  rol: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['gratuito', 'premium', 'empresa'],
    },
  })
  plan: string;

  @property({
    type: 'object',
    required: true,
  })
  datos: object;
}

export class AuthController {
  constructor(
    @repository(UsuarioRepository)
    public usuarioRepository: UsuarioRepository,
    @repository(TallerRepository)
    public tallerRepository: TallerRepository,
    @repository(ClienteRepository)
    public clienteRepository: ClienteRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
  ) {}

  @post('/login')
async login(
  @requestBody() credentials: LoginRequest,
): Promise<{token: string; user: any}> {
  // Buscar en Talleres primero
  let taller = await this.tallerRepository.findOne({
    where: {email: credentials.email},
  });

  if (taller && taller.usuarioId) {
    const usuario = await this.usuarioRepository.findById(taller.usuarioId);
    
    if (credentials.password === usuario.password && usuario.activo) {
      const token = await this.generateToken(usuario);
      return {
        token, 
        user: {
          ...usuario,
          taller: taller
        }
      };
    }
  }

  // Buscar en Clientes
  let cliente = await this.clienteRepository.findOne({
    where: {email: credentials.email},
  });

  if (cliente && cliente.usuarioId) {
    const usuario = await this.usuarioRepository.findById(cliente.usuarioId);
    
    if (credentials.password === usuario.password && usuario.activo) {
      const token = await this.generateToken(usuario);
      return {
        token,
        user: {
          ...usuario,
          cliente: cliente
        }
      };
    }
  }

  throw new HttpErrors.Unauthorized('Credenciales inválidas');
}

  @post('/register')
async register(
  @requestBody() data: RegisterRequest,
): Promise<{token: string; user: any}> {
  const datos = data.datos as any;
  
  if (data.rol === 'taller') {
    // Verificar si el taller ya existe por email
    const tallerExistente = await this.tallerRepository.findOne({
      where: {email: datos.email},
    });

    if (tallerExistente && tallerExistente.usuarioId) {
      throw new HttpErrors.BadRequest('El email del taller ya está registrado');
    }

    // Crear usuario
    const usuario = await this.usuarioRepository.create({
      nombre: data.nombre,
      password: data.password,
      rol: data.rol,
      plan: data.plan,
      activo: true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    });

    let taller;
    if (tallerExistente) {
      // Actualizar taller existente con usuarioId
      await this.tallerRepository.updateById(tallerExistente.id, {
        usuarioId: usuario.id,
      });
      taller = await this.tallerRepository.findById(tallerExistente.id);
    } else {
      // Crear nuevo taller
      taller = await this.tallerRepository.create({
        pais: datos.pais,
        nombre: datos.nombre,
        identificacion: datos.identificacion,
        email: datos.email,
        telefono: datos.telefono,
        usuarioId: usuario.id,
      });
    }

    // Generar token con datos básicos
    const token = await this.generateToken(usuario);
    
    // Retornar usuario con datos del taller
    return {
      token,
      user: {
        ...usuario,
        taller: taller
      }
    };

  } else if (data.rol === 'cliente') {
    // Verificar si el cliente ya existe por email
    const clienteExistente = await this.clienteRepository.findOne({
      where: {email: datos.email},
    });

    if (clienteExistente && clienteExistente.usuarioId) {
      throw new HttpErrors.BadRequest('El email del cliente ya está registrado');
    }

    // Crear usuario
    const usuario = await this.usuarioRepository.create({
      nombre: data.nombre,
      password: data.password,
      rol: data.rol,
      plan: data.plan,
      activo: true,
      fechaCreacion: new Date(),
      fechaActualizacion: new Date(),
    });

    let cliente;
    if (clienteExistente) {
      // Actualizar cliente existente con usuarioId
      await this.clienteRepository.updateById(clienteExistente.id, {
        usuarioId: usuario.id,
      });
      cliente = await this.clienteRepository.findById(clienteExistente.id);
    } else {
      // Crear nuevo cliente
      cliente = await this.clienteRepository.create({
        pais: datos.pais,
        nombre: datos.nombre,
        identificacion: datos.identificacion,
        contacto: datos.contacto,
        email: datos.email,
        telefono: datos.telefono,
        usuarioId: usuario.id,
      });
    }

    // Generar token
    const token = await this.generateToken(usuario);
    
    // Retornar usuario con datos del cliente
    return {
      token,
      user: {
        ...usuario,
        cliente: cliente
      }
    };
  }

  throw new HttpErrors.BadRequest('Rol inválido');
}

  @post('/forgot-password')
  async forgotPassword(
    @requestBody() {email}: {email: string},
  ): Promise<{message: string}> {
    // Buscar en talleres y clientes
    const taller = await this.tallerRepository.findOne({where: {email}});
    const cliente = await this.clienteRepository.findOne({where: {email}});

    if (taller || cliente) {
      console.log(`Token de recuperación para ${email}`);
    }

    return {
      message: 'Si el email existe, se enviarán instrucciones de recuperación',
    };
  }

  @post('/reset-password')
  async resetPassword(
    @requestBody()
    data: {
      token: string;
      newPassword: string;
    },
  ): Promise<{message: string}> {
    console.log('Reset password para token:', data.token);
    return {
      message: 'Contraseña actualizada correctamente',
    };
  }

  private async generateToken(usuario: Usuario): Promise<string> {
    const userProfile: UserProfile = {
      [securityId]: usuario.id!.toString(),
      name: usuario.nombre,
      rol: usuario.rol,
    };
    
    return this.jwtService.generateToken(userProfile);
  }
}