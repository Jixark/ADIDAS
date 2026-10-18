"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomiseModule = void 0;
const common_1 = require("@nestjs/common");
const customise_service_1 = require("./customise.service");
const customise_controller_1 = require("./customise.controller");
const typeorm_1 = require("@nestjs/typeorm");
const customise_entity_1 = require("./entities/customise.entity");
const events_gateway_1 = require("../events.gateway");
const sessions_module_1 = require("../sessions/sessions.module");
let CustomiseModule = class CustomiseModule {
};
exports.CustomiseModule = CustomiseModule;
exports.CustomiseModule = CustomiseModule = __decorate([
    (0, common_1.Module)({
        controllers: [customise_controller_1.CustomiseController],
        providers: [customise_service_1.CustomiseService, events_gateway_1.EventsGateway],
        imports: [
            typeorm_1.TypeOrmModule.forFeature([customise_entity_1.Customise]),
            sessions_module_1.SessionsModule,
        ],
        exports: [customise_service_1.CustomiseService, events_gateway_1.EventsGateway],
    })
], CustomiseModule);
//# sourceMappingURL=customise.module.js.map