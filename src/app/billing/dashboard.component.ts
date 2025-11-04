import { Component, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { Tenant, TenantService } from '../services/tenant.service';
import { Invoice, InvoiceService } from '../services/invoice.service';
import { AuthService } from '../core/auth.service';
@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, CurrencyPipe],
  template: `
  <div class="flex flex-col h-screen bg-gray-100">
    <!-- Main content -->
    <div class="flex-1 p-8 overflow-y-auto pb-20">
      <div class="max-w-6xl mx-auto">
        <!-- Header -->
        <div class="flex items-center justify-between mb-6">
          <h1 class="text-2xl md:text-3xl font-bold">Gestion des factures</h1>
          <button class="text-sm link" (click)="logout()">Se déconnecter</button>
        </div>

        <!-- Tenants View -->
        <div *ngIf="activeView() === 'tenants'">
          <div class="card">
            <div class="flex items-center justify-between mb-2">
              <h2 class="text-xl font-semibold">Locataires</h2>
              <button class="btn btn-primary px-3 py-2" (click)="resetTenantForm()">Nouveau</button>
            </div>
            <div class="table overflow-x-auto mb-4">
              <table class="min-w-full">
                <thead><tr><th>Nom</th><th>Appartement</th><th>Pourcentage</th><th style="width:140px">Actions</th></tr></thead>
                <tbody>
                  <tr *ngFor="let t of tenants()">
                    <td>{{ t.name }}</td>
                    <td>{{ t.apartment }}</td>
                    <td>{{ t.percent }}%</td>
                    <td class="space-x-2">
                      <button class="text-sm link" (click)="editTenant(t)">Éditer</button>
                      <button class="text-sm text-red-600 hover:underline" (click)="removeTenant(t)">Supprimer</button>
                    </td>
                  </tr>
                  <tr *ngIf="tenants().length === 0">
                    <td colspan="4" class="text-center text-gray-500 py-3">Aucun locataire — ajoutez-en un.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <form class="grid grid-cols-1 md:grid-cols-3 gap-3" [formGroup]="tenantForm" (ngSubmit)="saveTenant()">
              <input class="input" type="text" placeholder="Nom" formControlName="name">
              <input class="input" type="text" placeholder="Appartement" formControlName="apartment">
              <input class="input" type="number" placeholder="% part" formControlName="percent">
              <div class="md:col-span-3 flex gap-3">
                <button class="btn btn-primary" type="submit" [disabled]="tenantForm.invalid">{{ editId ? 'Mettre à jour' : 'Ajouter' }}</button>
                <button class="btn px-4 py-3 bg-gray-200" type="button" (click)="resetTenantForm()">Annuler</button>
              </div>
            </form>
            <div class="text-sm text-gray-500 mt-2">La somme des pourcentages devrait être 100% (validation non bloquante).</div>
          </div>
        </div>

        <!-- Add Invoice View -->
        <div *ngIf="activeView() === 'add-invoice'">
          <div class="card">
            <h2 class="text-xl font-semibold mb-2">Ajouter une facture</h2>
            <form class="space-y-4" [formGroup]="billForm" (ngSubmit)="calculateAndSave()">
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
              <button class="btn btn-primary" type="submit">Calculer & Enregistrer</button>
            </form>
            <div class="mt-6" *ngIf="results().length">
              <h3 class="text-lg font-semibold mb-2">Montants à payer</h3>
              <div class="table overflow-x-auto">
                <table class="min-w-full">
                  <thead><tr><th>Locataire</th><th>%</th><th>Montant à payer</th></tr></thead>
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

        <!-- History View -->
        <div *ngIf="activeView() === 'history'">
          <div class="card">
            <div class="flex items-center gap-3 mb-4">
              <h2 class="text-xl font-semibold">Historique des factures</h2>
              <input class="input w-48" placeholder="Filtrer par période (ex: Jan–Fév 2025)" [(ngModel)]="filterPeriod" (ngModelChange)="loadInvoices()" />
            </div>
            <div class="table overflow-x-auto">
              <table class="min-w-full">
                <thead><tr><th>Date</th><th>Période</th><th>Montant total</th><th>Détail (résumé)</th></tr></thead>
                <tbody>
                  <tr *ngFor="let i of invoices()">
                    <td>{{ i.createdAt | date:'short' }}</td>
                    <td>{{ i.period }}</td>
                    <td>{{ i.total | currency:'XOF':'symbol':'1.0-0':'fr-FR' }}</td>
                    <td>{{ getSummary(i) }}</td>
                  </tr>
                  <tr *ngIf="invoices().length === 0">
                    <td colspan="4" class="text-center text-gray-500 py-3">Aucune facture enregistrée pour cette recherche.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Navigation Bar -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white shadow-t">
      <div class="flex justify-around max-w-6xl mx-auto">
        <a (click)="setView('tenants')" class="flex flex-col items-center justify-center w-full py-2 text-gray-700 hover:bg-gray-200" [class.text-blue-500]="activeView() === 'tenants'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197" />
          </svg>
          <span class="text-xs">Locataires</span>
        </a>
        <a (click)="setView('add-invoice')" class="flex flex-col items-center justify-center w-full py-2 text-gray-700 hover:bg-gray-200" [class.text-blue-500]="activeView() === 'add-invoice'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span class="text-xs">Facture</span>
        </a>
        <a (click)="setView('history')" class="flex flex-col items-center justify-center w-full py-2 text-gray-700 hover:bg-gray-200" [class.text-blue-500]="activeView() === 'history'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-xs">Historique</span>
        </a>
      </div>
    </nav>
  </div>
  `
})
export class DashboardComponent {
  activeView = signal<'tenants' | 'add-invoice' | 'history'>('tenants');
  tenants = signal<Tenant[]>([]);
  tenantForm!: FormGroup;
  editId: string | null = null;
  billForm!: FormGroup;
  results = signal<{ name: string; percent: number; amount: number }[]>([]);
  invoices = signal<Invoice[]>([]);
  filterPeriod = '';
  constructor(
    private fb: FormBuilder,
    private tenantSrv: TenantService,
    private invoiceSrv: InvoiceService,
    private auth: AuthService
  ) {
    this.tenantForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      apartment: ['', [Validators.required]],
      percent: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    });
    this.billForm = this.fb.group({
      period: ['Jan–Fév 2025', Validators.required],
      total: [102800, [Validators.required, Validators.min(0)]],
    });
    this.tenantSrv.getTenants().subscribe(list => this.tenants.set(list));
    this.loadInvoices();
  }
  resetTenantForm() { this.editId = null; this.tenantForm.reset({ name: '', apartment: '', percent: 0 }); }
  editTenant(t: Tenant) { this.editId = t.id || null; this.tenantForm.patchValue({ name: t.name, apartment: t.apartment, percent: t.percent }); }
  async saveTenant() {
    if (this.tenantForm.invalid) return;
    const value = this.tenantForm.value as Tenant;
    if (this.editId) await this.tenantSrv.updateTenant(this.editId, value);
    else await this.tenantSrv.addTenant(value);
    this.resetTenantForm();
  }
  async removeTenant(t: Tenant) { if (!t.id) return; await this.tenantSrv.deleteTenant(t.id); }
  calculate() {
    const total = Number(this.billForm.value.total || 0);
    const out = this.tenants().map(t => ({ name: t.name, percent: t.percent, amount: Math.round((t.percent / 100) * total) }));
    this.results.set(out);
  }
  async calculateAndSave() {
    this.calculate();
    const invoice: Invoice = { period: this.billForm.value.period!, total: Number(this.billForm.value.total!), results: this.results(), createdAt: Date.now() };
    await this.invoiceSrv.addInvoice(invoice);
    this.loadInvoices();
  }
  async loadInvoices() {
    if (this.filterPeriod && this.filterPeriod.trim() !== '') {
      this.invoiceSrv.getInvoicesByPeriod(this.filterPeriod).subscribe(list => this.invoices.set(list));
    } else {
      this.invoiceSrv.getAllInvoices().subscribe(list => this.invoices.set(list));
    }
  }
  getSummary(invoice: any): string {
    if (!invoice?.results) return '';
    return invoice.results.map((r: any) => `${r.name} ${r.amount}F`).join(', ');
  }
  async logout() { await this.auth.logout(); }
  setView(view: 'tenants' | 'add-invoice' | 'history') {
    this.activeView.set(view);
  }
}
