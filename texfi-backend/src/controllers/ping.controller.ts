// src/controllers/ping.controller.ts
import {inject} from '@loopback/core';
import {get} from '@loopback/rest';

export class PingController {
  constructor() {}

  @get('/ping')
  ping(): object {
    return {
      greeting: 'Texfi OEE Platform',
      date: new Date(),
      url: 'https://texfi-app.netlify.app',
      environment: process.env.NODE_ENV,
    };
  }
}