import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { Button } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';


@Component({
  selector: 'app-user-books',
  standalone: true,
  imports: [CommonModule, ToastModule, Button, ReactiveFormsModule],
  providers: [MessageService],
  templateUrl: './user-books.component.html',
  styleUrl: './user-books.component.css'
})
export class UserBooksComponent implements OnInit {
  books: any[] = [];

  bookRating = new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(5)]);
  bookLike = new FormControl<boolean>(false);

  activeRatingBookId: number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private messageService: MessageService
  ) {}

  showSuccess() {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Message Content' });
    }

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
        this.messageService.add({ severity: 'success', summary: 'Úspěch', detail: 'Kniha byla odstraněna.' });
      },
      error: (err) => {
        console.error('Chyba při odstraňování knihy:', err);
        this.messageService.add({ severity: 'error', summary: 'Chyba', detail: 'Knihu se nepodařilo odstranit.' });
      }   
    });
  }

  toggleRatingForm(bookId: number) {
    this.activeRatingBookId = this.activeRatingBookId === bookId ? null : bookId;
  }

  sendRating(book: any) {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.sendRating({
        bookId: book.id,
        bookRating: this.bookRating.value ?? 0,
        bookLike: this.bookLike.value ? true : false
      }).subscribe({
        next: (res) => {
          this.messageService.add({ severity: 'success', summary: 'Úspěch', detail: 'Recenze byla odeslána.' });
        },
        error: (err) => {
          this.messageService.add({ severity: 'error', summary: 'Chyba', detail: 'Recenzi se nepodařilo odeslat.' });
        }
      });
      this.activeRatingBookId = null;
      this.bookRating.reset(5);
      this.bookLike.reset(false);
    }
  }
}
