import { Component, OnInit, Input } from '@angular/core';
import { EnumCountry } from '../../../core/enumerations/country';
import { PropertyService } from '../../../core/services/api-property.service';
import { Router } from '@angular/router';
import { CommunicationModel, CommunicationService } from '../../../core/services/communication.service';
import { TenantSearchCriteria } from '../../../core/models/TenantSearchCriteria';
import { TenantService } from '../../../core/services/tenant.service';
import { PagerService } from '../../../core/services/pager.service';


@Component({
    selector: 'app-view-property-tenants',
    templateUrl: './view-property-tenants.component.html',
    styleUrls: ['./view-property-tenants.component.scss']
})
export class ViewPropertyTenantsComponent implements OnInit {

    //@Input() tenantList: Array<any>;
    @Input() CountryId: number;
    @Input() PropertyId: number;
    showTenantDetails: boolean = false;
    selectedTenantInfo: any;
    tenantTitle: string = "";
    tenantList: Array<any>;
    constructor(private propertyService: PropertyService,
        private _router: Router,
        private _CommService: CommunicationService
        , private _tenantService: TenantService
        , private pagerService: PagerService) {

        this.tenantList = new Array<any>();
    }
    ngOnInit() {
        this.getTenantsByPropertyId();
    }
    getTenantsByPropertyId() {
        const tenantSearchCriteria = new TenantSearchCriteria();
        tenantSearchCriteria.StartingIndex = 1;
        tenantSearchCriteria.OffsetValue = 100;
        tenantSearchCriteria.CountryId = 14;
        tenantSearchCriteria.SortParam = 'CompanyName';
        tenantSearchCriteria.SortDirection = 'Ascending';
        tenantSearchCriteria.PropertyId = +this.PropertyId;

        // const tenant = this._tenantService.tenantSearch(tenantSearchCriteria);
        const tenant = this.propertyService.getTenantsByPropertyId(this.PropertyId);
        tenant.subscribe(result => {
            if (!JSON.parse(result['_body']).error) {
                const responseData = JSON.parse(result['_body']).responseData;
                //   this.tenantList = responseData && responseData.Tenants && responseData.Tenants[0] ? responseData.Tenants[0] : [];
                this.tenantList = responseData;
            }
        });
    }
    showPropertyTenant(tenant, PropertyId, TenantId) {
        // this.selectedTenantInfo = tenant;
        // this.showTenantDetails = true;      
        localStorage.setItem('selectedPropertyTenants', JSON.stringify(this.tenantList));

        this._router.navigate(['/property/details', PropertyId, "", TenantId]);
    }

    showMultiplePropertyTenant(PropertyId) {       
     
           this._router.navigate(['/property/details', PropertyId,""," "]);
       }
    
}