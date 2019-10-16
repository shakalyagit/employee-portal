import { HelperService } from './core/services/helper.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutModule } from './layout/layout.module';
import { AuthenticationService } from './authentication.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthGuardService } from './auth-guard.service';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HttpClientModule,
    ToastrModule.forRoot() 
  ],
  providers: [
  //   {
  //   provide: LocationStrategy,
  //   useClass: HashLocationStrategy,
  // },
  AuthenticationService,AuthGuardService, HelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
