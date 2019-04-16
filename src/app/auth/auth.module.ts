import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';  

import { AuthComponent } from './auth.component';
import { NoAuthGuard } from './no-auth-guard.service';
/* import { SharedModule } from '../shared'; */
import { AuthRoutingModule } from './auth-routing.module';
import { FormsModule }   from '@angular/forms';
import { SharedModule }         from '../shared/shared.module';

@NgModule({
  imports: [
    /* SharedModule, */
    AuthRoutingModule,
    FormsModule,
    CommonModule,
    SharedModule
    
  ],
  declarations: [
    AuthComponent
  ],
  providers: [
    NoAuthGuard
  ]
})
export class AuthModule {}
