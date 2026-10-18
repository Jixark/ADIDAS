import { ConfigService } from '@nestjs/config';
import { CustomiseService } from '../customise/customise.service';
import { EventsGateway } from '../events.gateway';
import { SessionsService } from '../sessions/sessions.service';
export declare class TasksService {
    private readonly configService;
    private readonly customiseService;
    private readonly eventsGateway;
    private readonly sessionsService;
    private readonly logger;
    private NUMBER_OF_SCREENS;
    private carouselDelayMs;
    private isCarouselRunning;
    constructor(configService: ConfigService, customiseService: CustomiseService, eventsGateway: EventsGateway, sessionsService: SessionsService);
    showCustomise(): Promise<void>;
    private delay;
    private buildCarouselBatch;
    checkCustomisesOnStart(): Promise<void>;
}
