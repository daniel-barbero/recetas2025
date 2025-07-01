import { Component } from '@angular/core';
import { BackupService, BackupItem } from '../services/backup.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-backup',
  templateUrl: './backup-component.html',
  styleUrls: ['./backup-component.scss'], // Corregido a styleUrls
  standalone: true,
  imports: [CommonModule, FormsModule]
})

export class BackupMultipleComponent {
  backups: BackupItem[] = [
    { key: 'recetas', fileName: 'recetas.json', label: 'Recetas' },
    { key: 'compra', fileName: 'compra.json', label: 'Lista de compra' },
  ];

  selectedBackup?: BackupItem;

  constructor(private backupService: BackupService) {}

  async exportar() {
    if (!this.selectedBackup || !this.backups.includes(this.selectedBackup)) {
      return alert('Selecciona un respaldo válido');
    }
    try {
      await this.backupService.exportarDatos(this.selectedBackup.key, this.selectedBackup.fileName);
      // Considera utilizar un componente de notificación más avanzado
      alert(`${this.selectedBackup.label} exportado correctamente`);
    } catch (e: any) {
      alert(e.message || 'Error exportando');
    }
  }

  async importar() {
    if (!this.selectedBackup || !this.backups.includes(this.selectedBackup)) {
      return alert('Selecciona un respaldo válido');
    }
    try {
      await this.backupService.importarDatos(this.selectedBackup.key);
      alert(`${this.selectedBackup.label} importado correctamente`);
    } catch (e: any) {
      alert(e.message || 'Error importando');
    }
  }

  async compartir() {
    if (!this.selectedBackup || !this.backups.includes(this.selectedBackup)) {
      return alert('Selecciona un respaldo válido');
    }
    try {
      await this.backupService.compartirArchivo(this.selectedBackup.fileName);
    } catch (e: any) {
      alert(e.message || 'Error compartiendo');
    }
  }
}
