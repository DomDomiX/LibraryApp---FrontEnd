import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PublicService } from '../shared/public.service';
import { AuthService } from '../shared/auth.service';
import { ToastModule } from 'primeng/toast';
import { Button } from 'primeng/button';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { Card } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { ConfirmDialog } from 'primeng/confirmdialog'; 

@Component({
  selector: 'app-homepage',
  imports: [ConfirmDialog,Divider,Card,CommonModule, ToastModule, Button],
  providers: [ConfirmationService, MessageService],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
    books: any[] = [];

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private publicService: PublicService,
        private authService: AuthService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
      if (isPlatformBrowser(this.platformId)) {
        this.getBooks();
      }
    }

    saveBook(book: any) {
      this.authService.saveBook({
        bookId: book.id,
        name: book.name,
        author: book.author,
        isbn: book.isbn
      }).subscribe({
        next: (res) => {
          console.log('Kniha uložena:', res);
          this.messageService.add({ severity: 'success', summary: 'Úspěch', detail: 'Kniha byla přidána.' });
        },
        error: (err) => {
          console.error('Chyba při ukládání knihy:', err);
          this.messageService.add({ severity: 'error', summary: 'Chyba', detail: 'Knihu už máte přidanou.' });
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
