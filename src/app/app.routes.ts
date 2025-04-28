import { Routes } from '@angular/router';
import { UserBooksComponent } from './user-books/user-books.component'; 

export const routes: Routes = [
    { path: '', redirectTo: 'userBooks', pathMatch: 'full' },
    { path: 'userBooks', component: UserBooksComponent},
];
