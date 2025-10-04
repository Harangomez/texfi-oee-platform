import {inject, lifeCycleObserver, LifeCycleObserver} from '@loopback/core';
import {juggler} from '@loopback/repository';

const config = {
  name: "postgresql",
  connector: "postgresql",
  url: process.env.DATABASE_URL, // ✅ CAMBIA ESTA LÍNEA
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