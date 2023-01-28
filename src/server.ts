import 'dotenv/config';
import app from './app';
import logger from './config/logger';

const PORT: number = Number(process.env.PORT) || 5000;

function main(): void {
  app.listen(PORT, () => {
    logger.info.info(`Server is running on port ${PORT}`);
  });
}

main();
