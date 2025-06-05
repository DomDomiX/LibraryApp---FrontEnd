import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Addresa Backendu
  private baseUrl = 'http://localhost:3000/api/auth';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  // Metody odkazující na metody na backendu
  register(data: { firstName: string; lastName: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, data).pipe(
      tap((response: any) => {
        console.log('Celá odpověď z loginu:', response);
        if (response && response.accessToken && isPlatformBrowser(this.platformId)) {
          localStorage.setItem('token', response.accessToken);
          console.log('Token uložen do localStorage:', response.accessToken);
          console.log('Načtený token hned po uložení:', localStorage.getItem('token'));
        } else if (!isPlatformBrowser(this.platformId)) {
          console.log('localStorage není dostupný na serveru, token se neuloží.');
        } else {
          console.error('accessToken chybí v odpovědi:', response);
        }
      })
    );
  }

  saveBook(data: {bookId: string; name: string; author: string, isbn: string}): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    
    return this.http.post(`${this.baseUrl}/bookSave`, data, { headers });
  }

  getUserBooks(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('localStorage není dostupný na serveru, přeskakuji volání getBooks.');
      throw new Error('Cannot access localStorage on server');
    }

    const token = localStorage.getItem('token');
    console.log('Načtený token:', token);
    if (!token) {
      throw new Error('No token found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    console.log('Posílaná hlavička:', headers.get('Authorization'));
    return this.http.get(`${this.baseUrl}/userBooks`, { headers });
  }

  removeUserBook(bookId: number): Observable<any> {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${this.baseUrl}/bookRemove/${bookId}`, { headers });
  }

  sendRating(data: { bookId: number; bookRating: number; bookLike: boolean}) {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/sendRating`, data, { headers });
  }

  verifyToken(token: string): Observable<{ valid: boolean }> {
    return this.http.post<{ valid: boolean }>(`${this.baseUrl}/verifyToken`, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      } 
    });
  }

  getUserProfile(): Observable<any> {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('Cannot access localStorage on server');
    }

    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/getProfile`, { headers });
  }

  updateUserProfile(data: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    bio?: string;
    profilePhoto?: string;
  }): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.put(`${this.baseUrl}/updateProfile`, data, { headers });
  }

  changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/change-password`, data, { headers });
  }

  getUserStats(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get(`${this.baseUrl}/user-stats`, { headers });
  }

  uploadProfilePhoto(file: File): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const formData = new FormData();
    formData.append('profilePhoto', file);

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this.baseUrl}/upload-photo`, formData, { headers });
  }

  removeProfilePhoto(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.delete(`${this.baseUrl}/profile-photo`, { headers });
  }
}