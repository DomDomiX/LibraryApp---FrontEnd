import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PublicService } from '../shared/public.service';
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
        private publicService: PublicService
    ) {}

    ngOnInit() {
      if (isPlatformBrowser(this.platformId)) {
        this.getBooks();
      }
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
