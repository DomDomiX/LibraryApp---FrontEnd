import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common'; 
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'LibraryApp';
  userName = '';
  loggedIn = false;
  books: any[] = [];

  constructor(public router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.whoAmI();
  }

  whoAmI() {
    if (isPlatformBrowser(this.platformId)) {
      const user = localStorage.getItem("user");
      console.log("Načtený user:", user);  // Logujme obsah načtený z localStorage
      if (user) {
        const userObj = JSON.parse(user);
        this.userName = userObj.name;
        console.log("Načtené jméno:", this.userName);  // Logujme jméno
        this.loggedIn = true;
      }
    }
  }

  // <-- TODO: Udelat odhlaseni --> 
  logout() {
    // Odstraní uživatelská data z localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.loggedIn = false;
    this.userName = '';
    // Přesměruje na přihlašovací stránku
    this.router.navigate(['/login']);
  }
}
