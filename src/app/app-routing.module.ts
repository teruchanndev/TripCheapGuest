import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

import { CreateInfoComponent } from './infomations/create-info/create-info.component';
import { InformationComponent } from './infomations/information/information.component';
import { HeaderComponent } from './menu/header/header.component';
import { HomeComponent } from './pages/home/home.component';
import { TicketCreateComponent } from './tickets/ticket-create/ticket-create.component';
import { TicketDetailComponent } from './tickets/ticket-detail/ticket-detail.component';
import { TicketEditComponent } from './tickets/ticket-edit/ticket-edit.component';
import { TicketListComponent } from './tickets/ticket-list/ticket-list.component';
import { TicketsAllComponent } from './tickets/tickets-all/tickets-all.component';
import { CartComponent } from './pages/cart/cart.component';
import { TicketDetailUpdateComponent } from './tickets/ticket-detail-update/ticket-detail-update.component';
import { PayComponent } from './pages/pay/pay.component';
import { OrderComponent } from './pages/order/order.component';
import { DetailInfoComponent } from './pages/detail-info/detail-info.component';
import { PageSearchComponent } from './pages/page-search/page-search.component';
import { TicketsCategoryComponent } from './tickets/tickets-category/tickets-category.component';


const routes: Routes = [
  {path: '',
    redirectTo: 'home',
    pathMatch: 'full'},
  { path: '', component: HeaderComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'home', component: HomeComponent,
        children: [
          { path: '#', component: TicketsAllComponent},
      ]},
      { path: 'detail/:ticketId', component: TicketDetailComponent},
      { path: 'detail/update/:idCart', component: TicketDetailUpdateComponent},
      { path: 'cart', component: CartComponent },
      { path: 'search/:search', component: PageSearchComponent },
      { path: 'setting', component: DetailInfoComponent },
      { path: 'pay/:idCart', component: PayComponent },
      { path: 'order', component: OrderComponent },
      { path: 'city/:city', component: TicketsAllComponent },
      { path: 'category/:category', component: TicketsCategoryComponent }
    ]
  },
  { path: 'shop/info', component: CreateInfoComponent, canActivate: [AuthGuard] },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {

}
