import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { isPlatformBrowser } from '@angular/common'; 
import { Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from './shared/auth.service';

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

  constructor(public router: Router, @Inject(PLATFORM_ID) private platformId: Object, public authService: AuthService) {}

  ngOnInit() {
    this.whoAmI();
  }

  whoAmI() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        this.authService.verifyToken(token).subscribe({
          next: (res) => {
            if (res.valid) {
              const user = localStorage.getItem('user');
              if (user) {
                const userObj = JSON.parse(user);
                this.userName = userObj.name;
                this.loggedIn = true;
              }
            } else {
              this.clearSession(); // Token není platný
            }
          },
          error: () => {
            this.clearSession(); // Chyba při ověření tokenu
          }
        });
      } else {
        this.clearSession(); // Token neexistuje
      }
    }
  }

  logout() {
    // Odstraní uživatelská data z localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.loggedIn = false;
    this.userName = '';
    // Přesměruje na přihlašovací stránku
    this.router.navigate(['/login']);
  }

  // Vymaže session
  private clearSession() { 
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.loggedIn = false;
    this.userName = '';
  }
}
