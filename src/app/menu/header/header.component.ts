import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/modals/user.modal';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth_customer.service';
// import { AuthService } from '../../services/auth.service';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  valueSidebar = false;

  isExpanded = true;
  showSubmenu = false;
  isShowing = false;
  showSubSubMenu = false;
  customerId: string;
  username: string;
  imageAvt = '';
  user: User;

  constructor(
    private authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
    private userService: UserService,
    // private customerService: CustomerService
    ) {}


  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.customerId = this.authService.getCustomerId();
    this.username = this.authService.getUsername();
    console.log(this.customerId);
    console.log(this.username);
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
    console.log(this.userIsAuthenticated);
    if (this.userIsAuthenticated === true) {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        this.userService.getInfoUser().subscribe(
          infoData => {
            this.user = {
              username: infoData.username,
              nameShop: infoData.nameShop,
              imageAvt: infoData.imageAvt,
              imageCover: infoData.imageCover,
              desShop: infoData.desShop,
              follower: infoData.follower,
              watching: infoData.watching
            };

        });
      });
      this.imageAvt = this.user.imageAvt || '';
    }


  }

  onLogout() {
    this.authService.logout();
  }

  showChild(childPath) {
    this.router.navigate(['home', childPath]);
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
