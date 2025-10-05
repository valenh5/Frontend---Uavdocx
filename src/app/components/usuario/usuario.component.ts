import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ReclamoService } from '../../servicios/reclamo.service';
import { Reclamo } from '../../modelos/reclamo';
import { Compra} from '../../modelos/compra';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../servicios/compra.service';
import { OpinionService } from '../../servicios/opinion.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css'],   
})

export class UsuarioComponent implements OnInit {
  reclamos: Reclamo[] = [];
  compras: Compra[] = [];
  opiniones: any[] = [];
  usuarioId: number = 0;
  reclamoId: number = 0;
  usuarioLogueado: string | null = null;
  esAdminUsuario: boolean = false;
  mensajeError: string = '';
  reclamoIndex = 0;
compraIndex = 0;
opinionIndex = 0;

  constructor(
    private router: Router,
    private reclamoService: ReclamoService,
    private compraService: CompraService,
    private opinionService: OpinionService
  ) {}

  esAdmin(): boolean {
    this.esAdminUsuario = localStorage.getItem('esAdmin') === 'true';
    return this.esAdminUsuario;
  }

  obtenerUsuarioLogueado() {
    this.usuarioLogueado = localStorage.getItem('usuario');
  }

  ngOnInit(): void {
    this.obtenerUsuarioLogueado();
    this.esAdmin();
    this.nombre = localStorage.getItem('usuario') || '';
    this.email = localStorage.getItem('email') || '';
    const id = localStorage.getItem('id_usuario');
    this.usuarioId = id ? parseInt(id) : 0;
    this.cargarReclamosUsuario();
    this.cargarComprasUsuario();
    this.cargarOpinionesUsuario();
  }

  async cargarReclamosUsuario() {
    try {
      this.reclamos = await this.reclamoService.buscarReclamosPorUsuario(this.usuarioId);
    } catch (error) {
      console.error("Error al cargar reclamos del usuario:", error);
      this.reclamos = [];
    }
  }

  async cargarComprasUsuario() {
    try {
      this.compras = await this.compraService.retornarCompras(this.usuarioId).then(response => response.data);
    } catch (error) {
      console.error("Error al cargar compras del usuario:", error);
      this.compras = [];
    }
  }

  async cargarOpinionesUsuario() {
    try {
      this.opiniones = await this.opinionService.obtenerOpinionesPorUsuario(this.usuarioId);
    } catch (error) {
      console.error("Error al cargar opiniones del usuario:", error);
      this.opiniones = [];
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

  async opinar(compra: Compra){
    const existe = await this.opinionService.verificarExistencia(compra.id);
    if (!existe) {
      this.router.navigate(['opinion', compra.id], { state: { compra } });
    }else{
      this.mensajeError = 'Ya existe una opinion para esta compra.';
        setTimeout(() => {
          this.mensajeError = '';
        }, 2000);
        return;
    }
  }
}