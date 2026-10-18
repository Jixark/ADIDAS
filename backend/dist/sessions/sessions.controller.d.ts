import { SessionsService } from './sessions.service';
import { UpdateSessionDto } from './dto/update-session.dto';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    create(): Promise<import("./entities/session.entity").Session | undefined>;
    closeSession(): Promise<({
        status: string;
        session_end: Date;
        id: string;
        session_start: Date;
        customises: import("../customise/entities/customise.entity").Customise[];
    } & import("./entities/session.entity").Session) | undefined>;
    findAll(): Promise<import("./entities/session.entity").Session[]>;
    findOne(id: string): Promise<import("./entities/session.entity").Session | null>;
    update(id: string, updateSessionDto: UpdateSessionDto): string;
    remove(id: string): string;
}
