import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  modoRegistro = true;
  formularioRegistro: FormGroup;

  correo: string = '';
  password: string = '';
  confirmacion: string = '';

  constructor(private fb: FormBuilder) {
    this.formularioRegistro = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]],
      repetirContrasena: ['', [Validators.required]]
    });
  }

  registrarUsuario() {
    if (this.correo && this.password && this.confirmacion) {
      if (this.password === this.confirmacion) {
        alert('Usuario registrado correctamente');
      } else {
        alert('Las contraseñas no coinciden');
      }
    } else {
      alert('Por favor llena todos los campos');
    }
  }

  registrarseConGoogle() {
    alert('Registro con Google no implementado');
  }

  registrarseConGithub() {
    alert('Registro con GitHub no implementado');
  }

  registrarseConFacebook() {
    alert('Registro con Facebook no implementado');
  }

  cambiarModo(event: Event) {
    event.preventDefault();
    this.modoRegistro = false;
  }
}
