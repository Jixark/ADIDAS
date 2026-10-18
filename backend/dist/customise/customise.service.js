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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var CustomiseService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomiseService = void 0;
const common_1 = require("@nestjs/common");
const customise_entity_1 = require("./entities/customise.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sessions_service_1 = require("../sessions/sessions.service");
let CustomiseService = CustomiseService_1 = class CustomiseService {
    customiseRepository;
    sessionsService;
    logger = new common_1.Logger(CustomiseService_1.name);
    constructor(customiseRepository, sessionsService) {
        this.customiseRepository = customiseRepository;
        this.sessionsService = sessionsService;
    }
    async create(createCustomiseDto) {
        try {
            const activeSession = await this.sessionsService.findActiveSession();
            if (!activeSession) {
                return {
                    "message": "Error al enviar la customisación",
                    "error": "No existe una sesion activa",
                    "statusCode": 510
                };
            }
            const activeCustom = await this.customiseRepository.findBy({
                session_id: activeSession?.id,
                tablet_id: createCustomiseDto.tablet_id
            });
            createCustomiseDto.session_id = activeSession?.id || '';
            if (activeCustom.length > 0) {
                const existingCustom = activeCustom[0];
                Object.assign(existingCustom, createCustomiseDto);
                await this.customiseRepository.save(existingCustom);
                return existingCustom;
            }
            const newCustomise = this.customiseRepository.create(createCustomiseDto);
            await this.customiseRepository.save(newCustomise);
            return newCustomise;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            this.logger.error(`Error creating customisation: ${errorMessage}`, error);
            throw new common_1.InternalServerErrorException('Error al enviar la customisación');
        }
    }
    async findAll() {
        return await this.customiseRepository
            .createQueryBuilder('customise')
            .innerJoinAndSelect('customise.session', 'session')
            .where('session.status = :status', { status: 'active' })
            .getMany();
    }
    findOne(id) {
        return `This action returns a #${id} customise`;
    }
    update(id, updateCustomiseDto) {
        return `This action updates a #${id} customise`;
    }
    remove(id) {
        return `This action removes a #${id} customise`;
    }
};
exports.CustomiseService = CustomiseService;
exports.CustomiseService = CustomiseService = CustomiseService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customise_entity_1.Customise)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        sessions_service_1.SessionsService])
], CustomiseService);
//# sourceMappingURL=customise.service.js.map