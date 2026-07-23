import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormModalComponent } from '../../../shared/form-modal/form-modal.component';
import { CatalogService, ServiceCatalogItem } from '../../../core/services/catalog.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, FormsModule, FormModalComponent],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit{
  searchQuery = '';
  catalog: ServiceCatalogItem[] = [];
  page = 1;
  readonly pageSize = 5;

  showAddModal = false;
  readonly categories = ['Waste', 'Home', 'Travel', 'Electrical', 'Cleaning'];

  serviceForm = {
    name: '',
    category: 'Home',
    baseFee: 1000,
    slaHrs: 6,
    status: 'active' as 'active' | 'inactive',
  };

  constructor(
    private catalogService: CatalogService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.refreshCatalog();
  }

  onSearch(): void {
    this.page = 1;
    this.refreshCatalog();
  }

  statusBadge(status: string): string {
    return status === 'active' ? 'badge-green' : 'badge-gray';
  }

  openAddModal(): void {
    this.resetServiceForm();
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveService(): void {
    if (!this.serviceForm.name.trim()) {
      this.toast.show('Service name is required.', 'error');
      return;
    }
    if (!this.serviceForm.category.trim()) {
      this.toast.show('Category is required.', 'error');
      return;
    }
    if (this.serviceForm.baseFee <= 0) {
      this.toast.show('Base fee must be greater than zero.', 'error');
      return;
    }
    if (this.serviceForm.slaHrs <= 0) {
      this.toast.show('SLA hours must be greater than zero.', 'error');
      return;
    }

    const added = this.catalogService.addService({
      name: this.serviceForm.name,
      category: this.serviceForm.category,
      baseFee: this.serviceForm.baseFee,
      slaHrs: this.serviceForm.slaHrs,
      status: this.serviceForm.status,
    });

    this.refreshCatalog();
    this.page = 1;
    this.showAddModal = false;
    this.toast.show(`${added.name} added to catalog.`);
  }

  viewService(id: string): void {
    this.toast.show(`Viewing service ${id}`);
  }

  editService(id: string): void {
    this.toast.show(`Editing service ${id}`);
  }

  toggleStatus(item: ServiceCatalogItem): void {
    const updated = this.catalogService.toggleStatus(item.id);
    if (updated) {
      this.refreshCatalog();
      this.toast.show(`${updated.name} is now ${updated.status}.`);
    }
  }

  deleteService(item: ServiceCatalogItem): void {
    if (!window.confirm(`Delete service "${item.name}"?`)) return;
    const removed = this.catalogService.deleteService(item.id);
    if (removed) {
      this.refreshCatalog();
      this.toast.show('Service deleted.');
    }
  }

  get pagedCatalog(): ServiceCatalogItem[] {
    const start = (this.page - 1) * this.pageSize;
    return this.catalog.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.catalog.length / this.pageSize));
  }

  prevPage(): void {
    if (this.page > 1) this.page--;
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.page++;
  }

  private resetServiceForm(): void {
    this.serviceForm = {
      name: '',
      category: 'Home',
      baseFee: 1000,
      slaHrs: 6,
      status: 'active',
    };
  }

  private refreshCatalog(): void {
    this.catalog = this.catalogService.getCatalog(this.searchQuery);
  }
}
