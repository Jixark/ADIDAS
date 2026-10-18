import { Customise } from '../../customise/entities/customise.entity';
export declare class Session {
    id: string;
    session_start: Date;
    status: string;
    session_end: Date;
    customises: Customise[];
}
