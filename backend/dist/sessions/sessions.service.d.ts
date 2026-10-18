import { UpdateSessionDto } from './dto/update-session.dto';
import { Session } from './entities/session.entity';
import { Repository } from 'typeorm';
export declare class SessionsService {
    private readonly sessionRepository;
    constructor(sessionRepository: Repository<Session>);
    private formatSessionId;
    private getNextSessionSequence;
    create(): Promise<Session | undefined>;
    closeSession(): Promise<({
        status: string;
        session_end: Date;
        id: string;
        session_start: Date;
        customises: import("../customise/entities/customise.entity").Customise[];
    } & Session) | undefined>;
    findActiveSession(): Promise<Session | null | undefined>;
    findAll(): Promise<Session[]>;
    findOne(id: string): Promise<Session | null>;
    update(id: string, updateSessionDto: UpdateSessionDto): string;
    remove(id: string): string;
}
