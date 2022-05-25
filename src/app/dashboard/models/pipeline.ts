import { PipelineStage } from './pipeline-stage';

export class Pipeline {
    id:number;
    name:string="";
    type:string="";
    private:boolean;
    canUpdate:boolean;
    canDelete:boolean;
    canSync:boolean;
    canDeleteStages:boolean;
    preview = false;
    userId:number;
    stages : Array<PipelineStage> = new Array<PipelineStage>();
    isValid = false;
    isValidName = false;
    isValidStage = false;
    default = false;
    salesforcePipeline = false;
}
