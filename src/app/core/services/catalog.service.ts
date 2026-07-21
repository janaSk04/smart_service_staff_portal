import { Injectable } from '@angular/core';

export interface ServiceCatalogItem {
  id: string;
  name: string;
  category: string;
  baseFee: number;
  slaHrs: number;
  status: 'active' | 'inactive';
  requests: number;
}

const STORAGE_KEY = 'servex_service_catalog';

const DEFAULT_CATALOG: ServiceCatalogItem[] = [
  { id: 'SRV-1001', name: 'Garbage Collection', category: 'Waste', baseFee: 800, slaHrs: 4, status: 'active', requests: 422 },
  { id: 'SRV-1002', name: 'Plumbing Repair', category: 'Home', baseFee: 1500, slaHrs: 6, status: 'active', requests: 281 },
  { id: 'SRV-1003', name: 'Deep Cleaning', category: 'Home', baseFee: 3200, slaHrs: 12, status: 'active', requests: 194 },
  { id: 'SRV-1004', name: 'Pest Control', category: 'Home', baseFee: 3000, slaHrs: 24, status: 'inactive', requests: 89 },
  { id: 'SRV-1005', name: 'Airport Drop/Pickup', category: 'Travel', baseFee: 4500, slaHrs: 2, status: 'active', requests: 157 },
];

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
private catalog: ServiceCatalogItem[] = [];

  constructor() {
    this.loadCatalog();
  }

  getCatalog(query = ''): ServiceCatalogItem[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.catalog;
    return this.catalog.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
    );
  }

  toggleStatus(id: string): ServiceCatalogItem | null {
    const item = this.catalog.find((s) => s.id === id);
    if (!item) return null;
    item.status = item.status === 'active' ? 'inactive' : 'active';
    this.persist();
    return item;
  }

  deleteService(id: string): ServiceCatalogItem | null {
    const item = this.catalog.find((s) => s.id === id);
    if (!item) return null;
    this.catalog = this.catalog.filter((s) => s.id !== id);
    this.persist();
    return item;
  }

  addService(input: {
    name: string;
    category: string;
    baseFee: number;
    slaHrs: number;
    status: 'active' | 'inactive';
  }): ServiceCatalogItem {
    const item: ServiceCatalogItem = {
      id: `SRV-${Math.floor(1000 + Math.random() * 9000)}`,
      name: input.name.trim(),
      category: input.category.trim(),
      baseFee: input.baseFee,
      slaHrs: input.slaHrs,
      status: input.status,
      requests: 0,
    };
    this.catalog.unshift(item);
    this.persist();
    return item;
  }

  private loadCatalog(): void {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      this.catalog = Array.isArray(saved) && saved.length ? saved : [...DEFAULT_CATALOG];
    } catch {
      this.catalog = [...DEFAULT_CATALOG];
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.catalog));
  }
}
