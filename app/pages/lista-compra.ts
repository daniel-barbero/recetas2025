import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';

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
}
