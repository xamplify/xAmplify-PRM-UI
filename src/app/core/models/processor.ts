declare var $: any;
export class Processor {
    
    isProcessing:boolean = false;
    divHeight:string = "500px";
    className:string = "";



 public   set(processor:Processor){
    processor.isProcessing = true;
    processor.divHeight = $('.portlet.light').height()+"px";
    return processor;
}
 
 public remove(processor:Processor){
     processor.isProcessing = false;
     processor.divHeight = "500px";
     return processor;
 }

}
