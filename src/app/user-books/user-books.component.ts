import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-books.component.html',
  styleUrl: './user-books.component.css'
})
export class UserBooksComponent implements OnInit {
  books: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (!token) {
        this.router.navigate(['/login']);
        return;
      }
      this.getBooks();
    } else {
      console.log('Na serveru (SSR) přeskakuji načítání knih.');
    }
  }

  getBooks() {
    this.authService.getUserBooks().subscribe({
      next: (res) => {
        this.books = res;
        console.log('Načtené knihy:', this.books);
      },
      error: (err) => {
        console.error('Chyba při načítání knih:', err);
      }
    });
    console.log(this.books);
  }

  removeBook(bookid: number) {
    this.authService.removeUserBook(bookid).subscribe({
      next: () => {
        this.books = this.books.filter((book) => book.bookid !== bookid); // Odstranění knihy z lokálního pole
        console.log('Kniha odstraněna:', bookid);
      },
      error: (err) => {
        console.error('Chyba při odstraňování knihy:', err);
      }   
    });
  }
}
