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
