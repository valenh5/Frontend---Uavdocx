import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ReclamoService } from '../../servicios/reclamo.service';
import { Reclamo } from '../../modelos/reclamo';
import { Compra} from '../../modelos/compra';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../servicios/compra.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],   
})
export class UsuarioComponent implements OnInit {
  reclamos: Reclamo[] = [];
  compras: Compra[] = [];
  usuarioId: number = 0;
  reclamoId: number = 0;

  constructor(private router: Router, private reclamoService: ReclamoService) {}

  ngOnInit(): void {
    this.nombre = localStorage.getItem('usuario') || '';
    this.email = localStorage.getItem('email') || '';
    const id = localStorage.getItem('id_usuario');
    this.usuarioId = id ? parseInt(id) : 0;
    this.cargarReclamosUsuario();
    this.cargarComprasUsuario();
  }

  async cargarReclamosUsuario() {
    try {
      this.reclamos = await this.reclamoService.buscarReclamosPorUsuario(this.usuarioId);
    } catch (error) {
      console.error("Error al cargar reclamos del usuario:", error);
      this.reclamos = [];
    }
  }

  async cargarComprasUsuario(){
    try{
          this.compras = await CompraService.prototype.retornarCompras(this.usuarioId).then(response => response.data);
    }catch(error){
      console.error("Error al cargar compras del usuario:", error);
      this.compras = [];
    }
  }
  logeado: boolean = !!localStorage.getItem('token');
  nombre: string = '';
  email: string = '';
  redirigirLogin() {
    this.router.navigate(['login']);
  }

  cerrarSesion() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('email');
    localStorage.removeItem('esAdmin');
    localStorage.removeItem('token');
    localStorage.removeItem('id_usuario');
    this.router.navigate(['']);
  }

  async eliminarReclamo(id: number) {
    try {
      await this.reclamoService.eliminarReclamo(id);
      this.cargarReclamosUsuario();
    } catch (error) {
      console.error("Error al eliminar reclamo:", error);
    }
  }
}