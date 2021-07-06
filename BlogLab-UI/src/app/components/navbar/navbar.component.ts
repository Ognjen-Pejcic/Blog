import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApplicationUser } from 'src/app/models/account/application-user.model';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isCollapsed = true;
  user :ApplicationUser;
  constructor(
    public accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
  //   if(this.accountService.isLoggedIn())
  //  this.user = this.accountService.currentUserValue;
  //  console.log(this.user.admin)
  }

  logout() {
    this.accountService.logout();
    this.router.navigate(['/']);
  }
  users(){
    
  }

}
