import {KloutScoreDeltas} from './klout-score-deltas';
import {KloutScore} from './klout-score';
export class KloutPayload {
    scoreDeltas: KloutScoreDeltas;
    nick: String;
    score: KloutScore;
    kloutId: String;
}