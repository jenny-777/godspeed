import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule],
  template: `<router-outlet/>`,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
