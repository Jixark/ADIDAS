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
exports.CreateCustomiseDto = void 0;
const class_validator_1 = require("class-validator");
class CreateCustomiseDto {
    tablet_id = "";
    screen = "";
    line_id = "";
    user_name = "";
    session_id = "";
    round_id = "";
    timestamp = "";
    product_type = "";
    product_id = "";
    personalization = [];
}
exports.CreateCustomiseDto = CreateCustomiseDto;
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomiseDto.prototype, "tablet_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomiseDto.prototype, "screen", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomiseDto.prototype, "line_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomiseDto.prototype, "user_name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomiseDto.prototype, "session_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomiseDto.prototype, "round_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomiseDto.prototype, "timestamp", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomiseDto.prototype, "product_type", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCustomiseDto.prototype, "product_id", void 0);
__decorate([
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateCustomiseDto.prototype, "personalization", void 0);
//# sourceMappingURL=create-customise.dto.js.map