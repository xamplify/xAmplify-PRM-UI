export class SocialConnection {
    id: number;
    userId: number;
    accessToken: string;
    refreshToken: string;
    source: string;
    oAuthTokenValue: string;
    oAuthTokenSecret: string;
    profileId: string;
    profileName: string;
    profileImage: string;
    firstName: string;
    lastName: string;
    emailId: string;
    active: boolean;
    existingUser: boolean;

    twitterTotalTweetsCount: any = '-';
    twitterTotalFollowersCount: any = '-';
    twitterTotalFriendsCount: any = '-';

    facebookFanCount: any = '-';
    facebookFriendsCount: any = '_';

    weeklyPostsCount: number;
	page: boolean;
}