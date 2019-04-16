export enum ContainerEvents {
  Upload,
  Cancel,
  Delete
}

export enum FileObjectStatus {
  NotStarted,
  Uploading,
  Uploaded,
  Canceled,
  Deleted,
  Failed
}

export class FileObject {
  propertyId:number;
  personId:number;
  mediaId:number;
  status = FileObjectStatus.NotStarted;
  guid : any;
  fileName : any;
  MediaTypeId:number = 0 ;
  MediaSubTypeId:number = 0;
  Description:any = "";
  IsDefault:boolean;
  FileName:string;
  URL:any;
  Height:any;
  Width:any;
  constructor(public file: File) { 

    this.guid = this.generateUUID();
    this.fileName = this.guid+"."+this.getExtension();
  }
  

  generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
}

getExtension()
{
  return this.file.name.split('.').pop();
}

}

