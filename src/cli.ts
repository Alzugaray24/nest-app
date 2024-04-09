import { Command } from 'commander';
import * as dotenv from 'dotenv';

// Cargar las variables de entorno
dotenv.config();

// Crear un nuevo comando
const program = new Command();

// Definir opciones de línea de comandos
program
  .option('-d, --debug', 'Variable para debug', false)
  .option(
    '-p, --port <port>',
    'Puerto del servidor',
    process.env.PORT || '8080',
  )
  .option('--mode <mode>', 'Modo de trabajo', 'dev')
  .requiredOption(
    '-u, --user <user>',
    'Usuario que va a utilizar el aplicativo.',
    'No se ha declarado un usuario.',
  );

// Parsear argumentos de línea de comandos
program.parse(process.argv);

// Exportar el programa para su uso en otros archivos
export default program;
