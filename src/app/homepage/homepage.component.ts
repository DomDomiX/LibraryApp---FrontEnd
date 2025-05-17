import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PublicService } from '../shared/public.service';
import { AuthService } from '../shared/auth.service';
import { get } from 'http';

@Component({
  selector: 'app-homepage',
  imports: [],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
    books: any[] = [];

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private publicService: PublicService,
        private authService: AuthService
    ) {}

    ngOnInit() {
      if (isPlatformBrowser(this.platformId)) {
        this.getBooks();
      }
    }

    saveBook(book: any) {
      console.log('Odesílám na backend:', {
        bookId: book.id,
        name: book.name,
        author: book.author,
        isbn: book.isbn
      });
      this.authService.saveBook({
        bookId: book.id,
        name: book.name,
        author: book.author,
        isbn: book.isbn
      }).subscribe({
        next: (res) => {
          console.log('Kniha uložena:', res);
        },
        error: (err) => {
          console.error('Chyba při ukládání knihy:', err);
        }
      });
    }

    getBooks() {
    this.publicService.getAllBooks().subscribe({
      next: (res) => {
        this.books = res;
        console.log('Načtené knihy:', this.books);
      },
      error: (err) => {
        console.error('Chyba při načítání knih:', err);
      }
    });
  }
} 
