// Entry point — inicia el servidor HTTP
import { readFile } from 'node:fs/promises';

try {
  const envText = await readFile(new URL('./.env', import.meta.url), 'utf8');
  for (const line of envText.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const [{ default: app }, { connectDB }] = await Promise.all([
  import('./src/app.js'),
  import('./src/db.js'),
]);

const port = Number(process.env.PORT) || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`MotoWeb API escuchando en el puerto ${port}`));

    // Consolidación automática del mes anterior en workshop_stats.
    // Silenciosa y no bloqueante: nunca debe impedir el arranque del servidor.
    import('./src/services/workshopStats.service.js')
      .then(({ computeMonthlyStat }) => {
        const now = new Date();
        const previous = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
        return computeMonthlyStat(previous.getUTCFullYear(), previous.getUTCMonth() + 1);
      })
      .then(() => console.log('Rollup mensual de estadísticas actualizado.'))
      .catch((error) => console.warn('No se pudo consolidar el rollup mensual:', error.message));
  })
  .catch((error) => {
    console.error('No se pudo iniciar la API:', error.message);
    process.exit(1);
  });
