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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Customise = void 0;
const typeorm_1 = require("typeorm");
const session_entity_1 = require("../../sessions/entities/session.entity");
let Customise = class Customise {
    id;
    session;
    session_id;
    tablet_id;
    line_id;
    user_name;
    round_id;
    timestamp = new Date();
    product_type;
    product_id;
    personalization;
};
exports.Customise = Customise;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Customise.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => session_entity_1.Session, (session) => session.customises, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", session_entity_1.Session)
], Customise.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar' }),
    __metadata("design:type", String)
], Customise.prototype, "session_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 2 }),
    __metadata("design:type", String)
], Customise.prototype, "tablet_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Customise.prototype, "line_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Customise.prototype, "user_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Customise.prototype, "round_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: false, default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Customise.prototype, "timestamp", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Customise.prototype, "product_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Customise.prototype, "product_id", void 0);
__decorate([
    (0, typeorm_1.Column)('simple-array'),
    __metadata("design:type", Array)
], Customise.prototype, "personalization", void 0);
exports.Customise = Customise = __decorate([
    (0, typeorm_1.Entity)()
], Customise);
//# sourceMappingURL=customise.entity.js.map