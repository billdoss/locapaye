import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <div class="max-w-5xl mx-auto py-10 px-4">
    <div class="grid md:grid-cols-2 gap-8">
      <!-- Register -->
      <div class="card">
        <h1 class="text-3xl font-bold mb-6">Créer un compte</h1>
        <form class="space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <div>
            <label class="text-sm text-gray-600">Nom complet</label>
            <input class="input" type="text" formControlName="fullname" placeholder="Ex: Anna Dubois">
          </div>
          <div>
            <label class="text-sm text-gray-600">E-mail</label>
            <input class="input" type="email" formControlName="email" placeholder="anna@exemple.com">
          </div>
          <div>
            <label class="text-sm text-gray-600">Mot de passe</label>
            <input class="input" type="password" formControlName="password" placeholder="••••••••">
          </div>
          <div>
            <label class="text-sm text-gray-600">Confirmer le mot de passe</label>
            <input class="input" type="password" formControlName="confirm" placeholder="••••••••">
          </div>
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid">Créer un compte</button>
        </form>
        <div class="mt-6 text-sm">
          Vous avez déjà un compte?
          <a routerLink="/login" class="link font-medium">Se connecter</a>
        </div>
      </div>

      <!-- Info -->
      <div class="card">
        <h2 class="text-2xl font-semibold">Quelques secondes…</h2>
        <p class="mt-2 text-gray-600">Créez votre compte pour commencer à suivre vos charges partagées.</p>
      </div>
    </div>
  </div>
  `
})
export class RegisterComponent {
  form!: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
    fullname: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]],
    confirm: ['', [Validators.required]],
  }, { validators: this.passwordMatch });
  }

  passwordMatch(group: any) {
    const pass = group.get('password')?.value;
    const conf = group.get('confirm')?.value;
    return pass === conf ? null : { mismatch: true };
  }

  submit() {
    if (this.form.invalid) return;
    const { fullname, email, password } = this.form.value;
    this.auth.register(fullname!, email!, password!);
    this.router.navigate(['/dashboard']);
  }
}
