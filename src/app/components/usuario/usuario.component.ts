import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReclamoService } from '../../servicios/reclamo.service';
import { Reclamo } from '../../modelos/reclamo';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],   
})
export class UsuarioComponent implements OnInit {
  reclamos: Reclamo[] = [];
  usuarioId: number = 0;

  constructor(private router: Router, private reclamoService: ReclamoService) {}

  ngOnInit(): void {
    this.nombre = localStorage.getItem('usuario') || '';
    this.email = localStorage.getItem('email') || '';
    const id = localStorage.getItem('id_usuario');
    this.usuarioId = id ? parseInt(id) : 0;
    this.cargarReclamosUsuario();
  }

  cargarReclamosUsuario() {
    this.reclamoService.getReclamos()
      .then((todos: Reclamo[]) => {
  this.reclamos = todos.filter(r => r.id_usuario === this.usuarioId);
      })
      .catch(() => {
        this.reclamos = [];
      });
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