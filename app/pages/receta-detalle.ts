import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule  } from '@angular/router';
import { RecetasService, Receta } from '../services/recetas';

@Component({
  selector: 'receta-detalle',
  templateUrl: './receta-detalle.html',
  styleUrl: './receta-detalle.scss',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class RecetaDetalleComponent implements OnInit {
  receta?: Receta;

  constructor(
    private route: ActivatedRoute,
    private recetasService: RecetasService
  ) {}

  ngOnInit() {
  const id = Number(this.route.snapshot.paramMap.get('id'));
  this.recetasService.getRecetaById(id).then((receta) => {
    if (receta) {
      if (typeof receta.ingredients === 'string') {
        receta.ingredients = (receta.ingredients as string).split(',').map((i: string) => i.trim());
      }
      this.receta = receta;
    } else {
      console.log(`No se encontró receta con id: ${id}`);
    }
  }).catch((err) => {
    console.error('Error al obtener receta:', err);
  });
}



}
