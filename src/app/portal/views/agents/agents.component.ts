import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormModalComponent } from '../../../shared/form-modal/form-modal.component';
import { AdminAgent, PortalDataService } from '../../../core/services/portal-data.service';
import { ToastService } from '../../../core/services/toast.service';
import { getAgentHealthStyle } from '../../../core/utils/dashboard.util';

@Component({
  selector: 'app-agents',
  standalone: true,
  imports: [CommonModule, FormsModule, FormModalComponent],
  templateUrl: './agents.component.html',
  styleUrl: './agents.component.css'
})
export class AgentsComponent implements OnInit{
  agents: AdminAgent[] = [];
  page = 1;
  readonly pageSize = 8;

  showAddModal = false;
  readonly zones = ['Zone 1', 'Zone 2', 'Zone 3', 'Zone 4'];

  agentForm = {
    name: '',
    zone: 'Zone 1',
    email: '',
  };

  constructor(
    private data: PortalDataService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.refreshAgents();
  }

  healthStyle(health: string): { color: string; background: string } {
    return getAgentHealthStyle(health);
  }

  openAddModal(): void {
    this.resetAgentForm();
    this.showAddModal = true;
  }

  closeAddModal(): void {
    this.showAddModal = false;
  }

  saveAgent(): void {
    if (!this.agentForm.name.trim()) {
      this.toast.show('Agent name is required.', 'error');
      return;
    }
    if (!this.agentForm.zone.trim()) {
      this.toast.show('Zone is required.', 'error');
      return;
    }
    if (this.agentForm.email.trim() && !this.agentForm.email.includes('@')) {
      this.toast.show('Enter a valid email address.', 'error');
      return;
    }

    const added = this.data.addAdminAgent({
      name: this.agentForm.name,
      zone: this.agentForm.zone,
      email: this.agentForm.email.trim() || undefined,
    });

    this.refreshAgents();
    this.page = 1;
    this.showAddModal = false;
    this.toast.show(`${added.name} added as agent.`);
  }

  viewAgent(id: string): void {
    this.toast.show(`Viewing agent ${id}`);
  }

  editAgent(id: string): void {
    this.toast.show(`Editing agent ${id}`);
  }

  get pagedAgents(): AdminAgent[] {
    const start = (this.page - 1) * this.pageSize;
    return this.agents.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.agents.length / this.pageSize));
  }

  prevPage(): void {
    if (this.page > 1) this.page--;
  }

  nextPage(): void {
    if (this.page < this.totalPages) this.page++;
  }

  private resetAgentForm(): void {
    this.agentForm = {
      name: '',
      zone: 'Zone 1',
      email: '',
    };
  }

  private refreshAgents(): void {
    this.agents = [...this.data.adminAgents];
  }
}

