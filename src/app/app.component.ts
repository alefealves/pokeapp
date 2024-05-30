import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet, ReactiveFormsModule],
})
export class AppComponent {
  constructor() {}
}
