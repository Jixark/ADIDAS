import { CreateCustomiseDto } from './dto/create-customise.dto';
import { UpdateCustomiseDto } from './dto/update-customise.dto';
import { Customise } from './entities/customise.entity';
import { Repository } from 'typeorm';
import { SessionsService } from '../sessions/sessions.service';
export declare class CustomiseService {
    private readonly customiseRepository;
    private readonly sessionsService;
    private readonly logger;
    constructor(customiseRepository: Repository<Customise>, sessionsService: SessionsService);
    create(createCustomiseDto: CreateCustomiseDto): Promise<Customise | {
        message: string;
        error: string;
        statusCode: number;
    }>;
    findAll(): Promise<Customise[]>;
    findOne(id: number): string;
    update(id: number, updateCustomiseDto: UpdateCustomiseDto): string;
    remove(id: number): string;
}
