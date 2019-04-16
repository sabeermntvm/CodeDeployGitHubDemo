import { Injectable } from '@angular/core';
import { ApiBaseService } from './api-base.service';

@Injectable()
export class DMPService extends ApiBaseService {
    skresult: string;
    candy: string;

    public GetSKID(): string {

        let data: any = {};
        data.login = 'Ronin';
        data.account = 'ProspectSandbox';
        data.output = 'json';


        let response = this.httpGet('/admin/getsik.aspx?', data);
        response.subscribe(result => {
            //JSON.stringify(result);
            this.skresult = "";//result.Response.Success.message;
            console.log(this.skresult);


            let keys = this.skresult.split('/')
            let data: any = {};
            data.sik = keys[2] + '/' + keys[3];
            data.output = 'json';

            // let response1 = this.httpGet(keys[2] + '/InitSession.aspx?', data);
            // response1.subscribe(result => {
            //   
            //     //JSON.stringify(result);
            //     this.candy = "";//result.Response.Results.Data.Row.Candy;
            //     console.log(this.candy);
            //     
            // }, error => console.log(error));



        }, error => console.log(error));





        return this.skresult;
    }

    public GetCandy(): string {

        let candy: string;
        let candyDetails: any;

        // If candy available in collection, retrieve from collection
        if (candyDetails) {
            var candyMongo = candyDetails.findOne({ "name": "candy" });
            if (candyMongo && new Date().getTime() <= new Date(Date.parse(candyDetails.findOne({ "name": "candy" }).datetime) + 23 * 60 * 60 * 1000).getTime()) {
                candy = candyDetails.findOne({ "name": "candy" }).candy;
            }
        }

        //If couldnt find, generate new one.
        if (!candy) {
            candy = this.GenerateCandy();
        }

        return candy;
    }


    public GenerateCandy(): string {


        let skid: string;


        if (!skid) {
            skid = this.GetSKID();
        }

        if (skid) {


            // let keys = skid.split('/')
            // let data: any = {};
            // data.sik = keys[2] + '/' + keys[3];
            // data.output = 'json';
            // var intSessionURL = 'http://' + keys[1] + '.parcelstream.com/' + keys[2] + '/InitSession.aspx?';


            // let response = this.httpGet('intSessionURL', data);
            // response.subscribe(result => {
            
            //     //JSON.stringify(result);
            //     this.candy = "";//result.Response.Results.Data.Row.Candy;
            //     console.log(this.skresult);
              
            // }, error => console.log(error));

            // return this.candy;


return null;


            //     var result = Meteor.call('httpGet', intSessionURL, data);
            //     candyobj = JSON.parse(result.content);

            //     if (candyobj.Response.Results) {
            //         if (candyDetails) {
            //             candyDetails.remove({ "name": "candy" });
            //             candyDetails.insert({ name: "candy", candy: candyobj.Response.Results.Data.Row.Candy, datetime: new Date() });
            //         }
            //         console.info("Generated new Candy : " + candyobj.Response.Results.Data.Row.Candy);
            //         return candyobj.Response.Results.Data.Row.Candy;
            //     }
            //     else if (candyobj.Response.Error) {
            //         //To Do: Log Error
            //         return null;
            //     }
            // }
            // else {
            //     return null;
            // }
        }
    }
}


