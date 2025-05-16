import { Routes } from '@angular/router';
import { UserBooksComponent } from './user-books/user-books.component'; 
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';

export const routes: Routes = [
    { path: '', redirectTo: 'userBooks', pathMatch: 'full' },
    { path: 'userBooks', component: UserBooksComponent},
    { path: 'login', component: LoginComponent },
    { path: 'homepage', component: HomepageComponent }
];
