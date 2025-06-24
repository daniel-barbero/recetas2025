import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';

export interface Receta {
  id: number;
  title: string;
  ingredients: string[];
  advices: string;
  category: string;
  img: string;
}

@Injectable({
  providedIn: 'root',
})

export class RecetasService {
  private readonly url = 'assets/recetas.json';

  constructor(private http: HttpClient) {}

  async getRecetas(): Promise<Receta[]> {
    return await this.leerJson();
  }

  async getRecetaById(id: number): Promise<Receta | undefined> {
    const recetas = await this.getRecetas();
    return recetas.find((r) => Number(r.id) === id);
  }


  async leerJson(): Promise<any>  {
    const { value } = await Preferences.get({ key: 'recetas' });
    if (value) {
      return JSON.parse(value);
    } else {
      // El archivo no existe, copiar el archivo JSON de assets
      const response = await fetch('assets/recetas.json');
      const recetas = await response.json();
      await Preferences.set({ key: 'recetas', value: JSON.stringify(recetas) });
      return recetas;
    }
  }

  async escribirJson(recetas: any[]): Promise<void>{
    await Preferences.set({ key: 'recetas', value: JSON.stringify(recetas) });
  }

  async actualizarReceta(receta: Receta) {
    const recetas = await this.leerJson();
    const indice = recetas.findIndex((r: Receta) => r.id === receta.id);
    if (indice !== -1) {
      recetas[indice] = receta;
      await this.escribirJson(recetas);
    }
  }

  async agregarReceta(receta: Receta) {
    const recetas = await this.leerJson();
    recetas.push(receta);
    await this.escribirJson(recetas);
  }

  async eliminarReceta(id: number) {
    const recetas = await this.leerJson();
    const indice = recetas.findIndex((r: Receta) => r.id === id);
    if (indice !== -1) {
      recetas.splice(indice, 1);
      await this.escribirJson(recetas);
    }
  }


}

