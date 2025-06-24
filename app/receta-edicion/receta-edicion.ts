// receta-edicion.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecetasService, Receta } from '../services/recetas';

@Component({
  selector: 'receta-edicion',
  templateUrl: './receta-edicion.html',
  styleUrls: ['./receta-edicion.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class RecetaEdicionComponent implements OnInit {
  receta: Receta = {} as Receta;
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recetasService: RecetasService
  ) {}

  ngOnInit() {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.recetasService.getRecetaById(this.id).then((receta) => {
      if (receta) {
        this.receta = receta;
      } else {
        console.log(`No se encontró receta con id: ${this.id}`);
        // Puedes redirigir al usuario a una página de error aquí
      }
    });
  }

  guardarCambios() {
    this.recetasService.actualizarReceta(this.receta).then(() => {
      this.router.navigate(['/receta', this.id]);
    });
  }
}
