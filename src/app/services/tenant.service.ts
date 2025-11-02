import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, updateDoc, deleteDoc, doc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
export interface Tenant { id?: string; name: string; apartment: string; percent: number; }
@Injectable({ providedIn: 'root' })
export class TenantService {
  constructor(private firestore: Firestore) {}
  getTenants(): Observable<Tenant[]> {
    const ref = collection(this.firestore, 'tenants');
    return collectionData(ref, { idField: 'id' }) as Observable<Tenant[]>;
  }
  addTenant(tenant: Tenant) {
    const ref = collection(this.firestore, 'tenants');
    return addDoc(ref, tenant);
  }
  updateTenant(id: string, tenant: Tenant) {
    const ref = doc(this.firestore, `tenants/${id}`);
    return updateDoc(ref, { ...tenant });
  }
  deleteTenant(id: string) {
    const ref = doc(this.firestore, `tenants/${id}`);
    return deleteDoc(ref);
  }
}