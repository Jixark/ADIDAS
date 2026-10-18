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
exports.CustomiseController = void 0;
const common_1 = require("@nestjs/common");
const customise_service_1 = require("./customise.service");
const create_customise_dto_1 = require("./dto/create-customise.dto");
const update_customise_dto_1 = require("./dto/update-customise.dto");
let CustomiseController = class CustomiseController {
    customiseService;
    constructor(customiseService) {
        this.customiseService = customiseService;
    }
    create(createCustomiseDto) {
        return this.customiseService.create(createCustomiseDto);
    }
    findAll() {
        return this.customiseService.findAll();
    }
    findOne(id) {
        return this.customiseService.findOne(+id);
    }
    update(id, updateCustomiseDto) {
        return this.customiseService.update(+id, updateCustomiseDto);
    }
    remove(id) {
        return this.customiseService.remove(+id);
    }
};
exports.CustomiseController = CustomiseController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_customise_dto_1.CreateCustomiseDto]),
    __metadata("design:returntype", void 0)
], CustomiseController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CustomiseController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomiseController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_customise_dto_1.UpdateCustomiseDto]),
    __metadata("design:returntype", void 0)
], CustomiseController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CustomiseController.prototype, "remove", null);
exports.CustomiseController = CustomiseController = __decorate([
    (0, common_1.Controller)('customise'),
    __metadata("design:paramtypes", [customise_service_1.CustomiseService])
], CustomiseController);
//# sourceMappingURL=customise.controller.js.map