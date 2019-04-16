import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { Suggestion } from '../../core/models/suggestion';
import { LoginService } from '../../core/services';
import { PropertysummaryComponent } from '../propertysummary/propertysummary.component';
import { SuggestionsService } from '../../core/services/suggestions.service';
import { PopupmodelComponent } from '../popupmodel/popupmodel.component';
@Component({
  selector: 'app-propertycontact',
  templateUrl: './propertycontact.component.html',
  styleUrls: ['./propertycontact.component.css']
})

export class PropertycontactComponent implements OnInit {
  @Input() contactList: any;
  @Input() listingAgentsList: any;
  trueOwnerList: Array<any> = [];
  recordedOwnerList: Array<any> = [];
  propertyManagerList: Array<any> = [];
  leaseAgentList: Array<any> = [];
  saleAgentList: Array<any> = [];
  subLeaseAgentList: Array<any> = [];
  preImageUrl: any;
  isContact = false;
  imagePath = '';
  UserID: number;
  constructor(public _loginService: LoginService,
    public dialog: MatDialog,
    private property: PropertysummaryComponent,
    private suggestionservice: SuggestionsService) {
    this.imagePath = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + '/Media/';
    this.preImageUrl = `${environment.MediaS3DynamicImageBase}` + `${environment.MediaS3Path}` + `/Media/Thumbnail/300x300/`;
  }

  ngOnInit() {

    const loginData = this._loginService.UserInfo;
    if (loginData) {
      this.UserID = loginData.EntityID;
    }
    // if (!!this.contactList) {
    //   if (this.contactList.trueOwnerList.length > 0 || this.contactList.recordedOwnerList.length > 0 || this.contactList.propertyManagerList.length > 0)
    //     this.isContact = true;
    // }
    // if(!!this.listingAgentsList){
    // if (this.listingAgentsList.leaseAgentList.length > 0 || this.listingAgentsList.saleAgentList.length > 0 || this.listingAgentsList.subLeaseAgentList.length > 0)
    //   this.isContact = true;
    // }


    // this.contactList.forEach(contact => {
    //   if (contact.RoleName == "True Owner")
    //     this.trueOwnerList.push(contact);
    //   if (contact.RoleName == "Recorded Owner")
    //     this.recordedOwnerList.push(contact);
    //   if (contact.RoleName == "Property Manager")
    //     this.propertyManagerList.push(contact);

    // });
    // this.listingAgentsList.forEach(contact => {
    //   if (contact.ListingTypeDisplayName == "Direct Leasing")
    //     this.leaseAgentList.push(contact);
    //   if (contact.ListingTypeDisplayName == "Sale Listing")
    //     this.saleAgentList.push(contact);
    //   if (contact.ListingTypeDisplayName == "Sublease")
    //     this.subLeaseAgentList.push(contact);
    // });

  }

  onEditContact(contact, event) {
    event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '20%';
    dialogConfig.data = { labelvalue: 'Contact', value: '', comment: '' };
    const dialogRef = this.dialog.open(PopupmodelComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (!!result) {
        const suggestion = new Suggestion();
        suggestion.FieldName = '';
        suggestion.SuggestedValue = result.value;
        suggestion.SuggestionComment = result.comment;
        suggestion.Type = 'Contact';
        suggestion.SuggestionStatus = 'Initiated';
        suggestion.SentByUserID = this.UserID;
        suggestion.details = { PropertyId: this.property.propertyId,
          PropertyName: this.property.propertyDetails.PropertyName
         };

        if (contact.FullName) {
          suggestion.details.ContactFullName = contact.FullName;
        }

        if (contact.RoleName){
          suggestion.details.ContacRoleName = contact.RoleName;
        }

        this.suggestionservice.saveSuggestion(suggestion);

      }
    });
  }

  goToLink(urlPath: string) {
    let url: string = '';
    if (!/^http[s]?:\/\//.test(urlPath)) {
        url += 'http://';
    }
    url += urlPath;
    window.open(url, '_blank');
  }
}
