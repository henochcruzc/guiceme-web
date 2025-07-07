import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { RecaptchaSettings, RECAPTCHA_SETTINGS } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingInterceptorHelper } from './shared/interceptor/loading';
import { HttpWebInterceptor } from './shared/interceptor/http-web.interceptor';
import { Mensajes } from './shared/config/mensajes';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [
    AppComponent
 ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxSpinnerModule,
    SharedModule,
    BrowserAnimationsModule,
    MatTableModule
  ],
  providers: [Mensajes,
    { provide: HTTP_INTERCEPTORS, useClass: HttpWebInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorHelper, multi: true },
    { provide: RECAPTCHA_SETTINGS, useValue: {siteKey:environment.recaptcha.siteKey} as RecaptchaSettings},
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule {
 }
