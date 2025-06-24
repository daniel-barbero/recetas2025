import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecetasService, Receta } from '../services/recetas';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

@Component({
  selector: 'recetas-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './recetas-list.html',
  styleUrl: './recetas-list.scss'
})
export class RecetasListComponent implements OnInit {
  recetas: Receta[] = [];
  categorias: string[] = [];
  categoriaSeleccionada: string = 'todas';
  searchTerm: string = '';

  constructor(private recetasService: RecetasService) {}

  ngOnInit() {
    this.recetasService.getRecetas().then((data: Receta[]) => {
      this.recetas = data;
      this.categorias = [
        'todas',
        ...new Set(data.map(r => r.category).filter(Boolean))
      ];
    }).catch((error) => {
      console.error(error);
    });
  }
  /*
  async exportarDatos() {
    try {
      const { value } = await Preferences.get({ key: 'recetas' });

      if (!value) {
        console.warn('No hay datos para exportar');
        return;
      }

      const recetas = JSON.parse(value);

      if (Capacitor.getPlatform() === 'web') {
        const blob = new Blob([JSON.stringify(recetas, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'recetas.json';
        a.click();
        URL.revokeObjectURL(url);
      } else {
        await Filesystem.writeFile({
          path: 'recetas.json',
          data: JSON.stringify(recetas, null, 2),
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });

        console.log('Archivo exportado correctamente en app nativa');
      }
    } catch (error) {
      console.error('Error exportando datos:', error);
    }
  }
  async compartirArchivo() {
    try {
      // Obtener URI del archivo
      const fileUri = await Filesystem.getUri({
        path: 'recetas.json',
        directory: Directory.Documents,
      });

      await Share.share({
        title: 'Mis Recetas',
        text: 'Aquí tienes el archivo de recetas.',
        url: fileUri.uri,
        dialogTitle: 'Compartir archivo',
      });

      console.log('Archivo compartido');
    } catch (error) {
      console.error('Error al compartir el archivo:', error);
    }
  }
  async importarDatos() {
    try {
      if (Capacitor.getPlatform() === 'web') {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        return new Promise<void>((resolve, reject) => {
          input.onchange = async (e: Event) => {
            try {
              const inputEl = e.target as HTMLInputElement;
              const file = inputEl?.files?.[0];
              if (!file) {
                alert('No se seleccionó ningún archivo');
                return reject();
              }

              const text: string = await file.text(); // 👈 aseguramos tipo string
              await Preferences.set({ key: 'recetas', value: text }); // ✅ sin error ahora
              alert('Datos importados correctamente');
              resolve();
            } catch (err) {
              console.error('Error leyendo archivo:', err);
              reject(err);
            }
          };

          input.click();
        });
      } else {
        const result = await Filesystem.readFile({
          path: 'recetas.json',
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });

        await Preferences.set({ key: 'recetas', value: result.data });
        alert('Datos importados correctamente');
      }
    } catch (error) {
      console.error('Error importando datos:', error);
      alert('No se pudo importar el archivo.');
    }
  }
    */
  get recetasFiltradas(): Receta[] {
    return this.recetas
      .filter(r =>
        this.categoriaSeleccionada === 'todas'
          ? true
          : r.category === this.categoriaSeleccionada
      )
      .filter(r =>
        (r.title ?? '').toLowerCase().includes((this.searchTerm ?? '').toLowerCase())
      );
  }

}
