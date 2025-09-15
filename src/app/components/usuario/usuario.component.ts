import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],   
})
export class UsuarioComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.nombre = localStorage.getItem('usuario') || '';
    this.email = localStorage.getItem('email') || '';
  }

  nombre: string = '';
  email: string = '';

  cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('email');
    localStorage.removeItem('esAdmin');
    localStorage.removeItem('token');
    localStorage.removeItem('id_usuario');
    this.router.navigate(['']);
  }
}