import { Session } from '../../sessions/entities/session.entity';
export declare class Customise {
    id: string;
    session?: Session;
    session_id: string;
    tablet_id: string;
    line_id: string;
    user_name: string;
    round_id: string;
    timestamp: Date;
    product_type: string;
    product_id: string;
    personalization: string[];
}
