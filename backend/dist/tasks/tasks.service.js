"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TasksService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const customise_service_1 = require("../customise/customise.service");
const events_gateway_1 = require("../events.gateway");
const sessions_service_1 = require("../sessions/sessions.service");
let TasksService = TasksService_1 = class TasksService {
    configService;
    customiseService;
    eventsGateway;
    sessionsService;
    logger = new common_1.Logger(TasksService_1.name);
    NUMBER_OF_SCREENS;
    carouselDelayMs;
    isCarouselRunning = false;
    constructor(configService, customiseService, eventsGateway, sessionsService) {
        this.configService = configService;
        this.customiseService = customiseService;
        this.eventsGateway = eventsGateway;
        this.sessionsService = sessionsService;
        this.NUMBER_OF_SCREENS = this.configService.get('NUMBER_OF_SCREENS', 2);
        this.carouselDelayMs = this.configService.get('CAROUSEL_DELAY_MS', 10000);
    }
    async showCustomise() {
        if (this.isCarouselRunning) {
            this.logger.debug('Carousel already running. Skipping a new cycle.');
            return;
        }
        this.isCarouselRunning = true;
        try {
            const customisations = await this.customiseService.findAll();
            this.logger.debug(`Found ${customisations.length} customisations.`);
            this.logger.debug(`Number of screens: ${this.NUMBER_OF_SCREENS}`);
            if (!customisations.length) {
                this.logger.debug('No customisations found to send.');
                return;
            }
            const totalScreens = Math.max(1, this.NUMBER_OF_SCREENS);
            let carouselIndex = 0;
            while (true) {
                const currentCustomisations = await this.customiseService.findAll();
                if (!currentCustomisations.length) {
                    this.logger.debug('No customisations found yet. Waiting for new items.');
                    await this.delay(this.carouselDelayMs);
                    for (let screenIndex = 0; screenIndex < totalScreens; screenIndex += 1) {
                        const screen = String(screenIndex + 1);
                        this.eventsGateway.closeScreenSession(screen);
                    }
                    continue;
                }
                const batch = this.buildCarouselBatch(currentCustomisations, totalScreens, carouselIndex);
                const firstPayload = batch[0];
                const sessionId = firstPayload?.session_id;
                if (!sessionId) {
                    this.logger.warn('Customisation without session_id detected. Skipping.');
                    carouselIndex += 1;
                    await this.delay(this.carouselDelayMs);
                    continue;
                }
                const session = await this.sessionsService.findOne(sessionId);
                if (!session || session.status !== 'active') {
                    this.logger.debug(`Session ${sessionId} is no longer active. Stopping carousel.`);
                    break;
                }
                this.logger.debug(`Sending carousel batch ${carouselIndex + 1} for session ${sessionId}.`);
                for (let screenIndex = 0; screenIndex < batch.length; screenIndex += 1) {
                    const screen = String(screenIndex + 1);
                    const payload = batch[screenIndex];
                    const payloadWithMetadata = {
                        ...payload,
                        screen,
                        isCarousel: true,
                        carouselIndex: carouselIndex + 1,
                    };
                    this.logger.debug(`Sending customisation ${payload.id} to screen ${screen}`);
                    this.eventsGateway.sendToScreen(screen, payloadWithMetadata);
                }
                carouselIndex += 1;
                await this.delay(this.carouselDelayMs);
            }
        }
        finally {
            this.isCarouselRunning = false;
        }
    }
    delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    buildCarouselBatch(customisations, totalScreens, carouselIndex) {
        const batch = [];
        if (!customisations.length) {
            return batch;
        }
        const startIndex = carouselIndex % customisations.length;
        for (let screenIndex = 0; screenIndex < totalScreens; screenIndex += 1) {
            const payload = customisations[(startIndex + screenIndex) % customisations.length];
            batch.push(payload);
        }
        if (batch.length === 2 && customisations.length === 1) {
            batch[1] = batch[0];
        }
        return batch;
    }
    async checkCustomisesOnStart() {
        this.logger.debug('Checking customisations on start...');
        const totalScreens = Math.max(1, this.NUMBER_OF_SCREENS);
        for (let screenIndex = 0; screenIndex < totalScreens; screenIndex += 1) {
            const screen = String(screenIndex + 1);
            this.eventsGateway.closeScreenSession(screen);
        }
        await this.sessionsService.closeSession();
        await this.showCustomise();
    }
};
exports.TasksService = TasksService;
__decorate([
    (0, schedule_1.Cron)('*/1 * * * *', {
        name: 'ShowCustomisesOnStart',
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "showCustomise", null);
__decorate([
    (0, schedule_1.Timeout)('CheckCustomisesOnStart', 5000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TasksService.prototype, "checkCustomisesOnStart", null);
exports.TasksService = TasksService = TasksService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        customise_service_1.CustomiseService,
        events_gateway_1.EventsGateway,
        sessions_service_1.SessionsService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map