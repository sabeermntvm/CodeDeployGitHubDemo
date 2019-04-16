import { OnInit, OnDestroy, Directive, ElementRef, Renderer2, Input, HostListener } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { Router } from '@angular/router';
import { SuggestionsService } from '../../../core/services/suggestions.service';
import { LoginService } from '../../../core/services';
import { PopupmodelComponent } from '../../popupmodel/popupmodel.component';
import { Suggestion } from '../../../core/models/suggestion';
import { PropertysummaryComponent } from '../../propertysummary/propertysummary.component';

@Directive({
    selector: '[appFeedback]',
  })
export class FeedbackDirective implements OnInit, OnDestroy {

  @Input('appFeedback') 
  tab: string = null ;
  value: any ;
  comment: String = '';
  UserID: number;
  labelvalue = 'Feedback';
  PropertyId: number;

  constructor(public dialog: MatDialog,
      private el: ElementRef,
      private renderer: Renderer2,
      router: Router,
      private service: SuggestionsService,
      private property: PropertysummaryComponent,
      private _loginService: LoginService) {

      }
  ngOnInit() {
    this.PropertyId = this.property.propertyId;

    // login data
    const loginData = this._loginService.UserInfo;
    if (loginData) {
      this.UserID = loginData.EntityID;
    }
  }

  @HostListener('click')
  onClick() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '450px';
      if ($(window).width() < 767) {
        dialogConfig.width = '300px';
      }

    dialogConfig.data = { labelvalue: this.tab, value: this.value , comment: this.comment};
    const dialogRef = this.dialog.open(PopupmodelComponent, dialogConfig);
  // submitting the suggestion data
    dialogRef.afterClosed().subscribe( (result)  => {
      if (!!result ) {
        const suggestion = new Suggestion();
        suggestion.SuggestedValue = result.value;
        suggestion.SuggestionComment = result.comment;
        suggestion.Type = this.tab;
        suggestion.SuggestionStatus = 'Initiated';
        suggestion.SentByUserID = this.UserID;
        suggestion.details = {
          PropertyId: this.PropertyId,
          PropertyName: this.property.propertyDetails.PropertyName
        };

         this.service.saveSuggestion(suggestion);
      }
    });
  }

  ngOnDestroy() {
  }

}
