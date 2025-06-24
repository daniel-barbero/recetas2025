import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuHamburguesaComponent } from './menu-hamburguesa/menu-hamburguesa';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MenuHamburguesaComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected title = 'recetas-app';
}
