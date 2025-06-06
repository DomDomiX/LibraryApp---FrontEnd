import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Button } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { MessageService, ConfirmationService } from 'primeng/api';
import { error } from 'console';

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
  firstName: '',           
  lastName: '',            
  email: '',              
  phone: '',
  bio: '',
  profilePhoto: null,
  memberSince: new Date()
};

userStats = {
  totalBooks: 0,           
  avgRating: 0,
  favoriteBooks: 0,
  daysActive: 0
};

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private userService: UserService
  ) {
    this.initializeForms();
  }

  ngOnInit() {
    this.loadUserData();
    this.loadUserStats();
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

  loadUserStats() {
    this.userService.getUserStats().subscribe({
      next: (res) => {
        console.log('Načtené statistiky:', res);
        this.userStats = {
          totalBooks: res.totalBooks || 0,
          avgRating: res.avgRating || 0,
          favoriteBooks: res.favoriteBooks || 0,
          daysActive: res.daysActive || 0
        };
      },
      error: (error) => {
        console.error('Chyba při načítání statistik:', error);
      }
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
   this.userService.getUserProfile().subscribe({
      next: (res) => {
        this.userProfile = res;
        this.userForm.patchValue({
          firstName: this.userProfile.firstName,
          lastName: this.userProfile.lastName,
          email: this.userProfile.email,
          phone: this.userProfile.phone,
          bio: this.userProfile.bio
        });
      },
      error: (error) => {
      console.error('Chyba při načítání dat:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Chyba',
        detail: 'Nepodařilo se načíst uživatelská data.'
      });
    }
   });
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

      const formData = this.userForm.value;

      this.userService.updateUserProfile(formData).subscribe({
        next: (res) => {
          this.userProfile = res;
          this.saving = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Úspěch',
            detail: 'Profil byl úspěšně aktualizován.'
          });
        },
        error: (error) => {
        console.error('Chyba při ukládání:', error);
        this.saving = false;
        
        this.messageService.add({
          severity: 'error',
          summary: 'Chyba',
          detail: 'Nepodařilo se uložit profil.'
        });
      }
    });
    }
  }

  changePassword() {
    if (this.passwordForm.valid) {
      this.changingPassword = true;

      const formData = this.passwordForm.value;

      this.userService.changePassword(formData).subscribe({
        next: () => {
          this.changingPassword = false;
          this.passwordForm.reset();

          this.messageService.add({
            severity: 'success',
            summary: 'Úspěch',
            detail: 'Heslo bylo úspěšně změněno.'
          });
        },
        error: (error) => {
          console.error('Chyba při změně hesla:', error);
          this.changingPassword = false;

          this.messageService.add({
            severity: 'error',
            summary: 'Chyba',
            detail: 'Nepodařilo se změnit heslo.'
          });
        }
      });
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
