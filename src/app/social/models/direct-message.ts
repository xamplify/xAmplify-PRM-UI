import {TwitterProfile} from './twitter-profile';
export class DirectMessage {
    id: number;
    text: string;
    sender: TwitterProfile;
    recipient: TwitterProfile;
    createdAt: Date;
    extraData: Map<String, Object>;
}
