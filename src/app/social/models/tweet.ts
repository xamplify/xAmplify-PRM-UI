export class Tweet {
    idStr: String;
    text: String;
    createdAt: Date;
    fromUser: String;
    profileImageUrl: String;
    toUserId: Number;
    inReplyToStatusId: Number;
    inReplyToUserId: Number;
    inReplyToScreenName: String;
    fromUserId: Number;
    languageCode: String;
    source: String;
    retweetCount: Number;
    retweeted: boolean;
    retweetedStatus: Tweet;
    favorited: boolean;
    favoriteCount: Number;
}
