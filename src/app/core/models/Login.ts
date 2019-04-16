export class login{
    username: string;
    password: string;
}

export class UserModel{
     EntityID:number;
     CountryID:number;
     PersonName:string;
     IsLoggedin:boolean=false;
     CompanyID:number;
     RoleName:string;
     UnitId:number;
     MainPhotoUrl:string;
     MetroCentroidLat:any;
     MetroCentroidLong:any;
}