import { Routes } from '@angular/router';
import { RecetasListComponent } from './pages/recetas-list';
import { RecetaDetalleComponent } from './pages/receta-detalle';
import { RecetaEdicionComponent } from './receta-edicion/receta-edicion';
import { BackupMultipleComponent } from './backup-component/backup-component';
import { ListaCompraComponent } from './pages/lista-compra';

export const routes: Routes = [
  { path: '', component: RecetasListComponent },
  { path: 'receta/:id', component: RecetaDetalleComponent },
  { path: 'recetas/:id/editar', component: RecetaEdicionComponent },
  { path: 'backup', component: BackupMultipleComponent },
  { path: 'lista-compra', component: ListaCompraComponent },
];

