import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { FilePicker } from '@capawesome/capacitor-file-picker';

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
    if (!value) throw new Error('No hay datos para exportar');

    if (Capacitor.getPlatform() === 'web') {
      try {
        const blob = new Blob([value], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error al exportar datos en web:', error);
        throw new Error('No se pudo exportar los datos en la plataforma web');
      }
    } else {
      try {
        await Filesystem.writeFile({
          path: fileName,
          data: value,
          directory: Directory.External,
          encoding: Encoding.UTF8,
        });
      } catch (error) {
        console.error('Error al exportar datos en nativo:', error);
        throw new Error('No se pudo exportar los datos en la plataforma nativa');
      }
    }
  }

async importarDatos(key: string): Promise<void> {
  if (Capacitor.getPlatform() === 'web') {
    return new Promise<void>((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';

      input.onchange = async (event: Event) => {
        try {
          const target = event.target as HTMLInputElement;
          const file = target.files?.[0];
          if (!file) return reject('No se seleccionó ningún archivo');

          if (!file.name.endsWith('.json')) {
            return reject('El archivo seleccionado no es un JSON válido');
          }

          const text = await file.text();
          await Preferences.set({ key, value: text });
          resolve();
        } catch (err) {
          reject(err);
        }
      };

      input.click();
    });
  } else {
    try {
      const result = await FilePicker.pickFiles({
        types: ['json']
      });

      if (result.files.length === 0) throw new Error('No se seleccionó ningún archivo');

      const file = result.files[0];

      // Preferir path cuando esté disponible
      if (file.path) {
        const fileRead = await Filesystem.readFile({
          path: file.path,
          encoding: Encoding.UTF8
        });
        const text = typeof fileRead.data === 'string'
        ? fileRead.data
        : String(fileRead.data);
        await Preferences.set({ key, value: text });
      } else if (file.blob) {
        const text = await this.blobToText(file.blob);
        await Preferences.set({ key, value: text });
      } else {
        throw new Error('No se pudo leer el archivo seleccionado');
      }

    } catch (error) {
      console.error('Error al importar datos en nativo:', error);
      throw new Error('No se pudo importar los datos en la plataforma nativa');
    }
  }
}


async compartirArchivo(fileName: string): Promise<void> {
  try {
    const fileExists = await Filesystem.stat({
      path: fileName,
      directory: Directory.External,
    });

    if (!fileExists) {
      throw new Error('El archivo no existe');
    }

    const fileUri = await Filesystem.getUri({
      path: fileName,
      directory: Directory.External,
    });
    console.log('fileuri', fileUri);

    await Share.share({
      title: 'Compartir archivo',
      text: 'Aquí tienes el archivo exportado.',
      url: fileUri.uri,
      dialogTitle: 'Compartir',
    });
  } catch (error) {
    console.error('Error al compartir archivo:', error);
    throw new Error('No se pudo compartir el archivo');
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
