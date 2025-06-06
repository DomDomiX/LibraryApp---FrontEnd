import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    // Addresa Backendu
  private baseUrl = 'http://localhost:3000/api/user';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

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

    return this.http.put(`${this.baseUrl}/updateProfile`, data, { headers });
  }

  changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Observable<any> {
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

    return this.http.post(`${this.baseUrl}/change-password`, data, { headers });
  }

  getUserStats(): Observable<any> {
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

    return this.http.get(`${this.baseUrl}/user-stats`, { headers });
  }
}