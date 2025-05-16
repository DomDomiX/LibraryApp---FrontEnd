import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PublicService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // Veřejné načtení všech knih
  getAllBooks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/books`);
  }
}