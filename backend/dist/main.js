"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger_level_env = process.env.LOGGER_LEVEL;
    const loggerLevels = logger_level_env
        ? logger_level_env.split(',')
        : ['log'];
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: loggerLevels
    });
    const logger = new common_1.Logger('Main');
    const PORT = process.env.APP_PORT ? parseInt(process.env.APP_PORT) : 3100;
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        }
    }));
    app.enableCors();
    await app.listen(PORT ?? 3100);
    logger.log(`App running on port ${PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map