"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomiseDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_customise_dto_1 = require("./create-customise.dto");
class UpdateCustomiseDto extends (0, mapped_types_1.PartialType)(create_customise_dto_1.CreateCustomiseDto) {
}
exports.UpdateCustomiseDto = UpdateCustomiseDto;
//# sourceMappingURL=update-customise.dto.js.map