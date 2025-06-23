import { Routes } from '@angular/router';
import { RecetasListComponent } from './pages/recetas-list';
import { RecetaDetalleComponent } from './pages/receta-detalle';

export const routes: Routes = [
  { path: '', component: RecetasListComponent },
  { path: 'receta/:id', component: RecetaDetalleComponent },
];

