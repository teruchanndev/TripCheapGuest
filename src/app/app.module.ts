import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import {CommonModule } from '@angular/common';

import { ReactiveFormsModule, FormsModule  } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

import { AppComponent } from './app.component';
import { HeaderComponent } from './menu/header/header.component';
import { TicketCreateComponent } from './tickets/ticket-create/ticket-create.component';
import { TicketListComponent } from './tickets/ticket-list/ticket-list.component';
import { TicketEditComponent } from './tickets/ticket-edit/ticket-edit.component';
import { CategoryComponent } from './categories/category/category.component';
import { NgImageSliderModule } from 'ng-image-slider';

import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { AngularMaterialModule } from './angular-material.module';
import { AuthModule } from './auth/auth.module';
import { RouterModule } from '@angular/router';
import { InformationComponent } from './infomations/information/information.component';
import { CreateInfoComponent } from './infomations/create-info/create-info.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { TicketsAllComponent } from './tickets/tickets-all/tickets-all.component';
import { TicketDetailComponent } from './tickets/ticket-detail/ticket-detail.component';
import { TicketDetailUpdateComponent } from './tickets/ticket-detail-update/ticket-detail-update.component';
import { PayComponent } from './pages/pay/pay.component';
import { OrderComponent } from './pages/order/order.component';
import { DetailInfoComponent } from './pages/detail-info/detail-info.component';
import { QRCodeModule } from 'angularx-qrcode';
import { FooterComponent } from './menu/footer/footer.component';
import { PageSearchComponent } from './pages/page-search/page-search.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { AngularFireModule } from "@angular/fire";
import { environment } from 'src/environments/environment';
import { TicketsCategoryComponent } from './tickets/tickets-category/tickets-category.component';
import { CommentComponent } from './tickets/comment/comment.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TicketCreateComponent,
    TicketListComponent,
    TicketEditComponent,
    TicketsAllComponent,
    CategoryComponent,
    InformationComponent,
    CreateInfoComponent,
    HomeComponent,
    CartComponent,
    TicketDetailComponent,
    TicketDetailUpdateComponent,
    PayComponent,
    OrderComponent,
    DetailInfoComponent,
    FooterComponent,
    PageSearchComponent,
    TicketsCategoryComponent,
    CommentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    NgxMatSelectSearchModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AuthModule,
    NgxMaterialTimepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgImageSliderModule,
    QRCodeModule,
    CarouselModule,
    [SweetAlert2Module.forRoot()],
    AngularFireModule.initializeApp(environment.firebaseConfig, "cloud")
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    MatDatepickerModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
