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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const session_entity_1 = require("./entities/session.entity");
const typeorm_2 = require("typeorm");
let SessionsService = class SessionsService {
    sessionRepository;
    constructor(sessionRepository) {
        this.sessionRepository = sessionRepository;
    }
    formatSessionId(sequence) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const sequenceString = String(sequence).padStart(3, '0');
        return `${year}${month}${day}_${sequenceString}`;
    }
    async getNextSessionSequence() {
        const result = await this.sessionRepository.query(`SELECT nextval('sessions_sec') as seq`);
        const sequence = result?.[0]?.seq;
        return Number(sequence);
    }
    async create() {
        const activeSession = await this.sessionRepository.findOne({ where: { status: 'active' } });
        if (activeSession) {
            return;
        }
        const sequence = await this.getNextSessionSequence();
        const id = this.formatSessionId(sequence);
        const session = this.sessionRepository.create({ id });
        return await this.sessionRepository.save(session);
    }
    async closeSession() {
        const activeSession = await this.sessionRepository.findOne({ where: { status: 'active' } });
        if (activeSession) {
            const close = await this.sessionRepository.save({ ...activeSession, status: 'inactive', session_end: new Date() });
            return close;
        }
    }
    async findActiveSession() {
        try {
            return await this.sessionRepository.findOne({ where: { status: 'active' } });
        }
        catch (error) {
            console.error('Error finding active session:', error);
        }
    }
    async findAll() {
        return await this.sessionRepository.find();
    }
    async findOne(id) {
        return await this.sessionRepository.findOne({ where: { id } });
    }
    update(id, updateSessionDto) {
        return `This action updates a #${id} session`;
    }
    remove(id) {
        return `This action removes a #${id} session`;
    }
};
exports.SessionsService = SessionsService;
exports.SessionsService = SessionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SessionsService);
//# sourceMappingURL=sessions.service.js.map