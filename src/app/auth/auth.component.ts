import { Component, OnDestroy, Renderer2,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import pageSettings from '../config/page-settings';
import { LoginService } from '../core/services/login.service';
import pageMenus from '../config/page-menus';
import { SharedDataService } from '../core/services/shareddata.service';
/* import { UserService } from '../core/services/user.service'; */

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth.component.html'
})

export class AuthComponent implements OnDestroy {
  pageSettings = pageSettings;
  public invalidLogin : boolean;
  public invalidMessage : string;
  menus = pageMenus;
 


  constructor(private router: Router, private renderer: Renderer2, private _loginService: LoginService, private _sharedDataService : SharedDataService/* , private userService: UserService */ ) {
    this._loginService.logout();
    this.pageSettings.pageEmpty = true;
    this.renderer.addClass(document.body, 'bg-white');
    
  }

  ngOnDestroy() {
    this.pageSettings.pageEmpty = false;
    this.renderer.removeClass(document.body, 'bg-white');
  }

    formSubmit(loginForm: NgForm) {
    this.clearSearch();
    this.invalidLogin = false;
    if (loginForm.valid) {
      let userdata = {
        username: loginForm.value.username,
        password: loginForm.value.password
      };
      this.processLogin(userdata);
    }
    else {
      //this.validationError = true;
    }

  }
  

/*    formSubmit(loginForm: NgForm) {
    //this.router.navigate(['/dashboard']);
    this.invalidLogin = false;
   // this.validationError = false;
    if (loginForm.valid) {
      let userdata = {
        username: loginForm.value.username,
        password: loginForm.value.password
      };
       this.userService
      .attemptAuth('login', userdata)
      .subscribe(
        data => {
          this.router.navigate(['/dashboard']);
        },
        err => {}
      ); 

      
    }
    else {
      //this.validationError = true;
    }

  }
   */


  private processLogin(userdata: any) {

    this.invalidLogin = false;
    const response_userLogin = this._loginService.login(userdata);
    response_userLogin.subscribe(result => {
       if (result && this._loginService.UserInfo) {
         let userInfo = response_userLogin;
        this.umlDisplayCheckMethod();
        this.router.navigate(['/dashboard']);
      }
      else {
          this.invalidLogin = true;
          this.invalidMessage = result;
      }
    });
  }
 
  umlDisplayCheckMethod() {
    const loginData = JSON.parse(localStorage.getItem("currentUser"));
   const companyId = loginData.CompanyID;

   if (loginData) 
   {
      if(companyId == 2)
      {
        this.menus.forEach((menu,index) => {
          if (menu.title === "User Listing Management" || menu.title === "All Suggestions")
        {
          menu.display = true;
        }
        });

     }
}
   }


   clearSearch() {
    this._sharedDataService.searchCriteria = null;
    this._sharedDataService.searchProperties = [];
    this._sharedDataService.searchResultCount = null;
    sessionStorage.removeItem('page');

    this._sharedDataService.transactionSearchCriteria = null;
    this._sharedDataService.searchTransactions = [];
    this._sharedDataService.transactionSearchResultCount = null;
    this._sharedDataService.searchTransactionMap = null;
    localStorage.removeItem('transactionpage');

    this._sharedDataService.leaseSearchCriteria = null;
    this._sharedDataService.searchLeaseTransactionList = [];
    this._sharedDataService.searchLeaseTransactionMap = null;
    this._sharedDataService.leaseSearchResultCount = null;
    localStorage.removeItem('LeaseCurrentPage');    

    this._sharedDataService.tenantSearchCriteria = null;
    this._sharedDataService.tenantSearchResult = [];
    this._sharedDataService.tenantSearchResultCount = null;
    sessionStorage.removeItem('page');

    this._sharedDataService.selectedPropertyPin = null;
    this._sharedDataService.selectedLeasePin = null;
    this._sharedDataService.selectedTenantPin = null;
    this._sharedDataService.selectedSalePin = null;
    this._sharedDataService.searchCriteriaMapPin =  null;

    this._sharedDataService.setTenantStageID = "";
    this._sharedDataService.setBranchID = "";
  }

}



