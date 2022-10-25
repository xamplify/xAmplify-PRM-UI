import { SaveVideoFile } from "app/videos/models/save-video-file";

export class VideoFileEventEmitter {

    videoFile:SaveVideoFile = new SaveVideoFile();
    viewType:string = "";
    categoryId:number = 0;
    folderViewType:string = "";
}
