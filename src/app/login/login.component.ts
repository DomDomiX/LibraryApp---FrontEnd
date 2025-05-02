import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { AuthService } from '../shared/auth.service'; 

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatButtonModule, MatDividerModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  // Přihlašovací údaje
  mailLogin = new FormControl('', [Validators.required, Validators.email]);
  passwordLogin = new FormControl('', [Validators.required]);
  // Registrace
  firstNameRegister = new FormControl('', [Validators.required]);
  lastNameRegister = new FormControl('', [Validators.required]);
  mailRegister = new FormControl('', [Validators.required, Validators.email]);
  passwordRegister = new FormControl('', [Validators.required]);
  // Průběh přihlašování
  loggingIn: boolean = false;

  isRegistering = false;
  hide = signal(true);

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  constructor(public router: Router, private route: ActivatedRoute, public authService: AuthService) { }

  zmenitForm() {
    this.isRegistering = !this.isRegistering;
  }

  login() {
    this.authService.login({
      email: this.mailLogin.value!,
      password: this.passwordLogin.value!
    }).subscribe({
      next: (res) => {
        console.log("Přihlášení úspěšné:", res);
        localStorage.setItem("token", res.token);  // Uložíme JWT token
        this.router.navigate(['/userBooks']);
      },
      error: (err) => {
        console.error("Chyba při přihlášení:", err);
        alert("Přihlášení selhalo.");
      }
    });
  }

  register() {
    this.authService.register({
      firstName: this.firstNameRegister.value!,
      lastName: this.lastNameRegister.value!,
      email: this.mailRegister.value!,
      password: this.passwordRegister.value!
    }).subscribe({
      next: (res) => {
        console.log("Registrace úspěšná:", res);
        alert("Registrace proběhla úspěšně, můžeš se přihlásit.");
        this.zmenitForm(); // přepne zpět na login form
      },
      error: (err) => {
        console.error("Chyba při registraci:", err);
        alert("Registrace selhala.");
      }
    });
  }
}
