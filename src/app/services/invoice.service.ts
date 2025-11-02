import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, query, where, collectionData, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
export interface Invoice {
  id?: string;
  period: string;
  total: number;
  results: { name: string; percent: number; amount: number }[];
  createdAt: number;
}
@Injectable({ providedIn: 'root' })
export class InvoiceService {
  constructor(private firestore: Firestore) {}
  addInvoice(invoice: Invoice) {
    const ref = collection(this.firestore, 'invoices');
    return addDoc(ref, { ...invoice, createdAt: Date.now() });
  }
  getInvoicesByPeriod(period: string): Observable<Invoice[]> {
    const ref = collection(this.firestore, 'invoices');
    const q = query(ref, where('period', '==', period), orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Invoice[]>;
  }
  getAllInvoices(): Observable<Invoice[]> {
    const ref = collection(this.firestore, 'invoices');
    const q = query(ref, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<Invoice[]>;
  }
}