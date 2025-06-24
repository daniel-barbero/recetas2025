import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu-hamburguesa',
  templateUrl: './menu-hamburguesa.html',
  styleUrl: './menu-hamburguesa.scss',
  imports: [RouterModule]
})

export class MenuHamburguesaComponent {
  menuAbierto = false;
  //constructor(private router: Router) {}

  toggleMenu() {
    this.menuAbierto = !this.menuAbierto;
  }
}
