export class XtremandLog {
    id: number = null;
    userId: number = null;
    videoId: number = null;
    startTime: Date;
    endTime: Date;
    startDuration: number;
    stopDuration: number;
    deviceType: string;
    campaignId: number = null;
    os: string;
    actionId: number;
    city: string;
    country: string;
    isp: string;
    ipAddress: string;
    state: string;
    zip: string;
    latitude: string;
    longitude: string;
    countryCode: string;
    userAlias: string;
    videoAlias: string;
    campaignAlias: string;
    sessionId: string;
    startDurationHHMMSS: string;
    stopDurationHHMMSS: string;
    previousId: number = null;
}
