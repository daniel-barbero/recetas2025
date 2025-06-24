import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';

export interface BackupItem {
  key: string;
  fileName: string;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class BackupService {

  async exportarDatos(key: string, fileName: string): Promise<void> {
    const { value } = await Preferences.get({ key });
    if (!value) {
      throw new Error('No hay datos para exportar');
    }

    if (Capacitor.getPlatform() === 'web') {
      const blob = new Blob([value], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      await Filesystem.writeFile({
        path: fileName,
        data: value,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });
    }
  }

  async compartirArchivo(fileName: string): Promise<void> {
    try {
      const fileUri = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Documents,
      });

      await Share.share({
        title: 'Archivo de respaldo',
        text: `Archivo: ${fileName}`,
        url: fileUri.uri,
        dialogTitle: 'Compartir archivo',
      });
    } catch (error) {
      throw new Error('Error al compartir archivo: ' + (error as any).message);
    }
  }

  async importarDatos(key: string, fileName: string): Promise<void> {
    if (Capacitor.getPlatform() === 'web') {
      return new Promise<void>((resolve, reject) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = async (event: Event) => {
          try {
            const target = event.target as HTMLInputElement;
            const file = target.files?.[0];
            if (!file) {
              alert('No se seleccionó ningún archivo');
              return reject();
            }

            const text = await file.text();
            await Preferences.set({ key, value: text });
            alert('Datos importados correctamente');
            resolve();
          } catch (err) {
            console.error('Error leyendo archivo:', err);
            alert('Error al importar datos');
            reject(err);
          }
        };

        input.click();
      });
    } else {
      const result = await Filesystem.readFile({
        path: fileName,
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      });

      if (typeof result.data === 'string') {
        await Preferences.set({ key, value: result.data });
        alert('Datos importados correctamente');
      } else if (result.data instanceof Blob) {
        const text = await this.blobToText(result.data);
        await Preferences.set({ key, value: text });
        alert('Datos importados correctamente');
      } else {
        throw new Error('Formato de datos no soportado');
      }
    }
  }

  private blobToText(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsText(blob);
    });
  }
}
