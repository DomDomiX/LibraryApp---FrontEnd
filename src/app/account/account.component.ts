import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Button } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-account',
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    ToastModule, 
    ConfirmDialogModule,
    Button, 
    DividerModule
  ],
  providers: [MessageService, ConfirmationService],
  standalone: true,
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements OnInit{
  userForm!: FormGroup;
  passwordForm!: FormGroup;
  saving = false;
  changingPassword = false;
  
  // Password visibility toggles
  hideCurrentPassword = true;
  hideNewPassword = true;
  hideConfirmPassword = true;

  userProfile = {
    firstName: 'Jan',
    lastName: 'Novák',
    email: 'jan.novak@email.cz',
    phone: '+420 123 456 789',
    bio: 'Milovník knih a čtení. Rád objevujem nové žánre a autory.',
    profilePhoto: null as string | null,
    memberSince: new Date('2023-01-15')
  };

  userStats = {
    totalBooks: 25,
    avgRating: 4.2,
    favoriteBooks: 8,
    daysActive: 156
  };

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    this.loadUserData();
  }

  initializeForms() {
    this.userForm = this.fb.group({
      firstName: [this.userProfile.firstName, [Validators.required]],
      lastName: [this.userProfile.lastName, [Validators.required]],
      email: [this.userProfile.email, [Validators.required, Validators.email]],
      phone: [this.userProfile.phone],
      bio: [this.userProfile.bio]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: this.passwordMatchValidator 
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword');
    const confirmPassword = group.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    
    return null;
  }

  loadUserData() {
    // Načtení dat z localStorage nebo API
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      this.userProfile.firstName = user.firstName || 'Jan';
      this.userProfile.lastName = user.lastName || 'Novák';
      this.userProfile.email = user.email || 'jan.novak@email.cz';
      
      // Aktualizace formuláře
      this.userForm.patchValue({
        firstName: this.userProfile.firstName,
        lastName: this.userProfile.lastName,
        email: this.userProfile.email
      });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        this.messageService.add({
          severity: 'error',
          summary: 'Chyba',
          detail: 'Soubor je příliš velký. Maximální velikost je 5MB.'
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        this.messageService.add({
          severity: 'error',
          summary: 'Chyba',
          detail: 'Vyberte prosím obrázek.'
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userProfile.profilePhoto = e.target.result;
        this.messageService.add({
          severity: 'success',
          summary: 'Úspěch',
          detail: 'Profilová fotka byla nahrána.'
        });
      };
      reader.readAsDataURL(file);
    }
  }

  removeProfilePhoto() {
    this.confirmationService.confirm({
      message: 'Opravdu chcete odstranit profilovou fotku?',
      header: 'Potvrzení',
      icon: 'bi bi-exclamation-triangle',
      acceptLabel: 'Ano',
      rejectLabel: 'Ne',
      accept: () => {
        this.userProfile.profilePhoto = null;
        this.messageService.add({
          severity: 'info',
          summary: 'Úspěch',
          detail: 'Profilová fotka byla odstraněna.'
        });
      }
    });
  }

  saveProfile() {
    if (this.userForm.valid) {
      this.saving = true;
      
      // Simulace API volání
      setTimeout(() => {
        const formData = this.userForm.value;
        this.userProfile = { ...this.userProfile, ...formData };
        
        // Uložení do localStorage
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        this.saving = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Úspěch',
          detail: 'Profil byl úspěšně uložen.'
        });
      }, 1000);
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.changingPassword = true;
      
      // Simulace API volání
      setTimeout(() => {
        this.changingPassword = false;
        this.passwordForm.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'Úspěch',
          detail: 'Heslo bylo úspěšně změněno.'
        });
      }, 1500);
    }
  }

  resetForm() {
    this.userForm.patchValue({
      firstName: this.userProfile.firstName,
      lastName: this.userProfile.lastName,
      email: this.userProfile.email,
      phone: this.userProfile.phone,
      bio: this.userProfile.bio
    });
    
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: 'Formulář byl resetován.'
    });
  }
}
