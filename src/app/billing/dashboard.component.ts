import { Component, computed, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

type Tenant = { name: string; apartment: string; percent: number };

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, CurrencyPipe],
  template: `
  <div class="max-w-6xl mx-auto py-8 px-4">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl md:text-3xl font-bold">Gestion des factures</h1>
      <button class="text-sm link" (click)="logout()">Se déconnecter</button>
    </div>

    <div class="grid md:grid-cols-2 gap-8">
      <!-- Locataires -->
      <div class="card">
        <h2 class="text-xl font-semibold mb-4">Locataires</h2>
        <div class="table overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Appartement</th>
                <th>Pourcentage</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let t of tenants()">
                <td>{{ t.name }}</td>
                <td>{{ t.apartment }}</td>
                <td>{{ t.percent }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Ajouter une facture -->
      <div class="card">
        <h2 class="text-xl font-semibold mb-2">Ajouter une facture</h2>

        <form class="space-y-4" [formGroup]="billForm" (ngSubmit)="calculate()">
          <div>
            <label class="text-sm text-gray-600">Période</label>
            <input class="input" type="text" placeholder="Jan–Fév 2025" formControlName="period">
          </div>
          <div>
            <label class="text-sm text-gray-600">Montant total CIE</label>
            <div class="flex gap-2">
              <input class="input" type="number" formControlName="total" placeholder="102800">
              <span class="px-3 py-2 rounded-lg bg-gray-100 border text-gray-700">FCFA</span>
            </div>
          </div>
          <button class="btn btn-primary" type="submit">Calculer</button>
        </form>

        <div class="mt-6">
          <h3 class="text-lg font-semibold mb-2">Montants à payer</h3>
          <div class="table overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr>
                  <th>Locataire</th>
                  <th>%</th>
                  <th>Montant à payer</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let r of results()">
                  <td>{{ r.name }}</td>
                  <td>{{ r.percent }}</td>
                  <td>{{ r.amount | currency:'XOF':'symbol':'1.0-0':'fr-FR' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
})
export class DashboardComponent {
  tenants = signal<Tenant[]>([
    { name: 'Anna Dubois', apartment: 'Appartement 1', percent: 25 },
    { name: 'Paul Lefevre', apartment: 'Appartement 2', percent: 30 },
    { name: 'Marie Bernard', apartment: 'Appartement 3', percent: 20 },
    { name: 'Jean Moulin', apartment: 'Appartement 4', percent: 25 },
  ]);

  billForm!: FormGroup;
 

  results = signal<{ name: string; percent: number; amount: number }[]>([]);

  constructor(private fb: FormBuilder) {

    this.billForm = this.fb.group({
      period: ['Jan–Fév 2025', Validators.required],
      total: [102800, [Validators.required, Validators.min(0)]],
    });

    this.calculate();
  }

  calculate() {
    const total = Number(this.billForm.value.total || 0);
    const out = this.tenants().map(t => ({
      name: t.name,
      percent: t.percent,
      amount: Math.round((t.percent / 100) * total)
    }));
    this.results.set(out);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    location.href = '/';
  }
}
