import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { AuthService } from '../shared/auth.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { Button } from 'primeng/button';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import { RatingModule } from 'primeng/rating';
import { CheckboxModule } from 'primeng/checkbox'
import { FormsModule } from '@angular/forms';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Card } from 'primeng/card'; 
import { Divider } from 'primeng/divider'; 


@Component({
  selector: 'app-user-books',
  standalone: true,
  imports: [Divider, Card,ConfirmDialog, FormsModule ,RatingModule, CheckboxModule,CommonModule, ToastModule, Button, ReactiveFormsModule, MatSelectModule,MatFormFieldModule, MatInputModule, MatCheckboxModule],
  providers: [ConfirmationService ,MessageService],
  templateUrl: './user-books.component.html',
  styleUrl: './user-books.component.css'
})
export class UserBooksComponent implements OnInit {
  books: any[] = [];

  bookRating = new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(5)]);
  bookLike = new FormControl<boolean>(false);
  showRatingForm: boolean = false;
  activeRatingBookId: number | null = null;
  hoverRating: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
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

  removeBook(bookid: number, event: Event) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Opravdu chcete smazat tuto knihu?',
        header: 'Potvrzení smazání',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Zrušit',
        acceptLabel: 'Smazat',
        rejectButtonProps: {
            label: 'Zrušit',
            severity: 'secondary',
            outlined: true,
        },
        acceptButtonProps: {
            label: 'Smazat',
            severity: 'danger',
        },
        accept: () => {
            // Odstranění duplicitní zprávy
            this.authService.removeUserBook(bookid).subscribe({
                next: () => {
                    this.books = this.books.filter((book) => book.bookid !== bookid);
                    console.log('Kniha odstraněna:', bookid);
                    this.messageService.add({ 
                        severity: 'info', 
                        summary: 'Úspěch', 
                        detail: 'Kniha byla úspěšně odstraněna.' 
                    });
                },
                error: (err) => {
                    console.error('Chyba při odstraňování knihy:', err);
                    this.messageService.add({ 
                        severity: 'error', 
                        summary: 'Chyba', 
                        detail: 'Knihu se nepodařilo odstranit.' 
                    });
                }   
            });
        },
        reject: () => {
            console.log('Smazání bylo zrušeno');
            // Explicitně zavřít dialog
            this.confirmationService.close();
        },
    });
}

  openRatingForm(book: any) {
    this.activeRatingBookId = book.bookid;
    this.showRatingForm = true;
    this.bookRating.reset(5);
    this.bookLike.reset(false);
  }

  setRating(rating: number) {
    this.bookRating.setValue(rating); // Změněno z .value = rating
  }

  toggleLike() {
    this.bookLike.setValue(!this.bookLike.value); // Použití setValue()
  }

  sendRating(book: any, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    if (isPlatformBrowser(this.platformId)) {
      this.authService.sendRating({
        bookId: book.bookid,
        bookRating: Number(this.bookRating.value) ?? 0,
        bookLike: this.bookLike.value ? true : false
      }).subscribe({
        next: (res) => {
          this.messageService.add({ 
            severity: 'success', 
            summary: 'Úspěch', 
            detail: 'Recenze byla odeslána.' 
          });
        },
        error: (err) => {
          this.messageService.add({ 
            severity: 'error', 
            summary: 'Chyba', 
            detail: 'Recenzi se nepodařilo odeslat.' 
          });
        },
        complete: () => {
          this.showRatingForm = false;
          this.activeRatingBookId = null;
          this.bookRating.reset(5);
          this.bookLike.reset(false);
        }
      });
    }
  }

  closeRatingForm() {
  this.showRatingForm = false;
  this.activeRatingBookId = null;
  this.hoverRating = 0;
  // Reset formuláře
  this.bookRating.setValue(0);
  this.bookLike.setValue(false);
}
}
