import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-lista-compra',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-compra.html',
  styleUrl: './lista-compra.scss'
})
export class ListaCompraComponent {
  lista: string[] = [];
  nuevaItem = '';

  private key = 'compra';

  constructor() {
    this.cargarLista();
  }

  async cargarLista() {
    const { value } = await Preferences.get({ key: this.key });
    if (value) {
      try {
        this.lista = JSON.parse(value);
      } catch {
        this.lista = [];
      }
    }
  }

  async guardarLista() {
    await Preferences.set({ key: this.key, value: JSON.stringify(this.lista) });
  }

  async agregarItem() {
    if (this.nuevaItem.trim()) {
      this.lista.push(this.nuevaItem.trim());
      this.nuevaItem = '';
      await this.guardarLista();
    }
  }

  async eliminarItem(index: number) {
    this.lista.splice(index, 1);
    await this.guardarLista();
  }

  async limpiarLista() {
    this.lista = [];
    await Preferences.remove({ key: this.key });
  }

  async exportar() {
    const { value } = await Preferences.get({ key: this.key });
    if (!value) return alert('No hay datos para exportar');

    const data = JSON.stringify(JSON.parse(value));
    if (Capacitor.getPlatform() === 'web') {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'compra.json';
      a.click();
      URL.revokeObjectURL(url);
    } else {
      await Filesystem.writeFile({
        path: 'compra.json',
        data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
      alert('Archivo exportado en Documents/compra.json');
    }
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) throw new Error('Formato inválido');

      this.lista = parsed;
      await this.guardarLista();
      alert('Lista importada correctamente');
    } catch (e: any) {
      alert(e.message || 'Error al importar el archivo');
    }
  }
}
