// scripts/export-models.ts
import * as fs from 'fs';
import * as path from 'path';
import * as models from '../src/models';
import {ModelDefinition, getModelRelations} from '@loopback/repository';

function exportModelsToCSV() {
  const rows: string[] = [];
  rows.push("Modelo;Nombre;Tipo;Destino/Detalles");

  for (const [name, modelClass] of Object.entries(models)) {
    const definition: ModelDefinition = (modelClass as any).definition;

    // --- Propiedades ---
    if (definition && definition.properties) {
      for (const [propName, propMeta] of Object.entries(definition.properties)) {
        const type =
          typeof (propMeta as any).type === 'function'
            ? (propMeta as any).type.name
            : (propMeta as any).type || "Desconocido";

        rows.push(`${name};${propName};Propiedad;${type}`);
      }
    }

    // --- Relaciones ---
    const relations = getModelRelations(modelClass as any);
    for (const [relName, rel] of Object.entries(relations)) {
      rows.push(`${name};${relName};Relación (${rel.type});${rel.target().name}`);
    }
  }

  // Guardar en archivo CSV
  const filePath = path.join(__dirname, 'models-dictionary.csv');
  fs.writeFileSync(filePath, rows.join('\n'), 'utf8');
  console.log(`✅ Archivo generado: ${filePath}`);
}

exportModelsToCSV();
