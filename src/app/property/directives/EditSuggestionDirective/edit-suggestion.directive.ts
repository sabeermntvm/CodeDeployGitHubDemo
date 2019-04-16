import {Directive, ElementRef, HostListener, Input, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material';
import {Router} from '@angular/router';
import {Suggestion} from '../../../core/models/suggestion';
import {SuggestionsService} from '../../../core/services/suggestions.service';
import {PropertysummaryComponent} from '../../propertysummary/propertysummary.component';
import { LoginService } from '../../../core/services';
import { PopupmodelComponent } from '../../popupmodel/popupmodel.component';

@Directive({
  selector: '[appEditSuggestion]',
})
export class EditSuggestionDirective implements  OnInit, OnDestroy {
  @Input('appEditSuggestion') tab: string = null ;
  @Input('tenantId') tenantId: number = null;
  @Input('transactionId') transactionId: number = null;
  @Input('listingId') listingId: number = null;
  @Input('suiteId') suiteId: number = null;
  @Input('addStyle') addStyle: string =null;

  value: any ;
  comment: String = '';
  buttonel: any;
  listenglob: any;
  text: any;
  UserID: number;
  labelvalue = '';
  PropertyId: number;

  constructor(public dialog: MatDialog,
    private el: ElementRef,
    private renderer: Renderer2,
    router: Router,
    private service: SuggestionsService,
    private property: PropertysummaryComponent,
    private _loginService: LoginService) {
    
      this.PropertyId = this.property.propertyId;

    // login data
    const loginData = this._loginService.UserInfo;
    if (loginData) {
      this.UserID = loginData.EntityID;
    }

    // creating edit icon
    this.buttonel = this.renderer.createElement('i') ;
    this.renderer.setAttribute( this.buttonel, 'class', 'fas fa-check-double text-primary' );

    // adding click functionality to edit icon
    this.listenglob = this.renderer.listen(this.buttonel, 'click', (event) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.maxWidth = '450px';
      if ($(window).width() < 767) {
        dialogConfig.maxWidth = '300px';
      }
      if (this.el.nativeElement.firstChild.firstChild) {
        this.labelvalue = this.el.nativeElement.firstChild.firstChild.data;
      }
      dialogConfig.data = { labelvalue: this.labelvalue  , value: this.value , comment: this.comment, showSuggestedValue: true};
      const dialogRef = this.dialog.open(PopupmodelComponent, dialogConfig);

    // submitting the suggestion data
      dialogRef.afterClosed().subscribe( (result)  => {
        if (!!result ) {
          const suggestion = new Suggestion();
          suggestion.FieldName = this.el.nativeElement.firstChild.firstChild.data;
          suggestion.SuggestedValue = result.value;
          suggestion.SuggestionComment = result.comment;
          suggestion.Type = this.tab;
          suggestion.SuggestionStatus = 'Initiated';
          suggestion.SentByUserID = this.UserID;
          //todo: for other types populate the appropriate id - listingid, tenantid etc
          suggestion.details = {
            PropertyId: this.PropertyId,
            PropertyName: this.property.propertyDetails.PropertyName
          };
          if (this.tenantId) {
            suggestion.details.TenantId = this.tenantId;
          }

          if (this.transactionId) {
            suggestion.details.TransactionId = this.transactionId;
          }

          if (this.listingId) {
            suggestion.details.ListingId = this.listingId;
          }

          if (this.suiteId) {
            suggestion.details.SuiteId = this.suiteId;
          }

          this.service.saveSuggestion(suggestion);

        }
      });
    });
  }

  ngOnInit(): void {
  }

  @HostListener('mouseenter')
  onmouseenter(): void {
    if (this.el.nativeElement.children[1]) {
      if (this.addStyle) {
        this.renderer.setAttribute( this.buttonel, 'style', this.addStyle );
      } else {
        this.renderer.setAttribute( this.buttonel, 'style', 'margin-left:10px ; cursor:pointer; position:absolute' );
      }
      this.renderer.appendChild( this.el.nativeElement.children[1], this.buttonel);
    } else {
      if (this.addStyle) {
        this.renderer.setAttribute( this.buttonel, 'style', this.addStyle );
      } else {
        this.renderer.setAttribute( this.buttonel, 'style', 'margin-left:10px ; cursor:pointer; position:absolute' );
      }
      this.renderer.appendChild( this.el.nativeElement.children[0], this.buttonel);
    }
  }

  @HostListener('mouseleave')
  onmouseleave(): void {

    this.renderer.removeChild( this.el.nativeElement, this.buttonel);

  }
  ngOnDestroy(): void {
    this.listenglob();
  }

}
