import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: "postgresql",
  connector: "postgresql",
  url: process.env.DATABASE_URL, // ✅ Comentar esta línea para pruebas locales 
  ssl: {rejectUnauthorized: false,}, // ✅ Necesario para Neon
  

  /*//Comentar las siguientes líneas para actualizar el github que está conectado al despliegue
  url: '',
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Jolukateo1511',
  database: 'texfi_db',
  //Comentario final*/
};

@lifeCycleObserver('datasource')
export class PostgresqlDataSource extends juggler.DataSource implements LifeCycleObserver {
  static dataSourceName = 'postgresql';
  static readonly defaultConfig = config;
  constructor(
    @inject('datasources.config.postgresql', {optional: true})
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}