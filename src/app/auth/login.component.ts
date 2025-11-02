import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../core/auth.service';
@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
  <div class="max-w-5xl mx-auto py-10 px-4">
    <div class="grid md:grid-cols-2 gap-8">
      <div class="card">
        <h1 class="text-3xl font-bold mb-6">Se connecter</h1>
        <form class="space-y-4" [formGroup]="form" (ngSubmit)="submit()">
          <div>
            <label class="text-sm text-gray-600">E-mail</label>
            <input class="input" type="email" formControlName="email" placeholder="ex: anna@exemple.com">
          </div>
          <div>
            <label class="text-sm text-gray-600">Mot de passe</label>
            <input class="input" type="password" formControlName="password" placeholder="••••••••">
          </div>
          <button class="btn btn-primary" type="submit" [disabled]="form.invalid || loading">Se connecter</button>
          <div class="text-sm text-gray-500" *ngIf="error">{{ error }}</div>
        </form>
        <div class="mt-4 text-sm text-gray-600">
          Mot de passe <a class="link" href="javascript:void(0)">oublié?</a>
        </div>
        <div class="mt-6 text-sm">
          Vous n’avez pas de compte?
          <a routerLink="/register" class="link font-medium">Créer un compte</a>
        </div>
      </div>
      <div class="card">
        <h2 class="text-2xl font-semibold">Bienvenue 👋</h2>
        <p class="mt-2 text-gray-600">Connectez‑vous pour gérer vos locataires et répartir les factures.</p>
        <ul class="list-disc ml-6 mt-4 text-gray-700 space-y-1">
          <li>Gestion des pourcentages par appartement</li>
          <li>Calcul automatique des parts</li>
          <li>Historique par période</li>
        </ul>
      </div>
    </div>
  </div>
  `
})
export class LoginComponent {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  async submit() {
    if (this.form.invalid) return;
    const { email, password } = this.form.value;
    this.loading = true; this.error = null;
    try { await this.auth.login(email!, password!); }
    catch (e:any) { this.error = e?.message ?? 'Échec de connexion'; }
    finally { this.loading = false; }
  }
}