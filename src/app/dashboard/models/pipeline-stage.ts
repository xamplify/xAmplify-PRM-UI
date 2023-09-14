export class PipelineStage {
    id: number;
    stageName: string = "";
    defaultStage: boolean = false;
    won: boolean = false;
    lost: boolean = false;
    markAs: string = "";
    displayIndex: number;
    canDelete: boolean = true;
    private: boolean;
}
