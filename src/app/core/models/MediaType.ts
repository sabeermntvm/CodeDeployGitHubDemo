export class PropertyMedia {
    PropertyID: any;
    Path: any;
    Ext: string;
}

export class MediaType {
    MediaTypeID: number;
    MediaTypeName: string;
    IsActive: boolean;
    CreatedDate: any;
}

export class MediaSubType {
    MediaSubTypeID: number;
    MediaSubTypeName: string;
    IsActive: boolean;
}

export class Media {
    MediaID: number;
    PropertyID: number;
    RelationID: number;
    RelationshipTypeID: number;
    MediaName: string;
    Height: number;
    Width: number;
    Size: number;
    Path: string;
    Ext: string;
    URL: string;
    Description: string;
    CreatedDate: string;
    CreatedBy: number;
    ModifiedDate: string;
    ModifiedBy: number;
    ModifiedByName: string;
    MediaRelationshipID: number;
    MediaRelationTypeID: number;
    MediaRelationTypeName: string;
    MediaTypeID: number;
    MediaTypeName: string;
    MediaSubTypeID: number;
    MediaSubTypeName: string;
    IsActive: boolean = true;
    IsDefault: boolean = false;
    File: File;
}
