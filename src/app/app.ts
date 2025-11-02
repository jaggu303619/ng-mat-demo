import { Component } from '@angular/core';
import { RegistrationForm } from './registration-form/registration-form';

@Component({
  selector: 'app-root',
  imports: [RegistrationForm],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
}
