import { CustomiseService } from './customise.service';
import { CreateCustomiseDto } from './dto/create-customise.dto';
import { UpdateCustomiseDto } from './dto/update-customise.dto';
export declare class CustomiseController {
    private readonly customiseService;
    constructor(customiseService: CustomiseService);
    create(createCustomiseDto: CreateCustomiseDto): Promise<import("./entities/customise.entity").Customise | {
        message: string;
        error: string;
        statusCode: number;
    }>;
    findAll(): Promise<import("./entities/customise.entity").Customise[]>;
    findOne(id: string): string;
    update(id: string, updateCustomiseDto: UpdateCustomiseDto): string;
    remove(id: string): string;
}
