import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrendasService } from '../../servicios/prenda.service';
import { Prenda } from '../../modelos/prenda';
import { CarritoService } from '../../servicios/carrito.service';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment.prod';
import { UsuarioService } from '../../servicios/usuario.service';



@Component({
	selector: 'app-producto-detalle',
	standalone: true,
	imports: [CommonModule, FormsModule, RouterModule],
	templateUrl: './producto.component.html',
	styleUrls: ['./producto.component.css']
})
export class ProductoDetalleComponent implements OnInit {
	mostrarGuiaTalles = false;
	talleSeleccionado: string = '';
	  usuarioLogueado: string | null = null;
  esAdminUsuario: boolean = false;

  esAdmin(): boolean {
    this.esAdminUsuario = this.usuarioService.esAdminDesdeToken();
    return this.esAdminUsuario;
  }

  obtenerUsuarioLogueado() {
    this.usuarioLogueado = localStorage.getItem('usuario');
  }
	producto: Prenda | null = null;
	cargando: boolean = true;
	mensajeExito: string = '';
  mensajeError: string = '';
  cantidad: number = 1;
  apiUrl: string = environment.apiUrl + "/prendas";
  prendas: Prenda[] = [];
  paginaActual: number = 1;
  limitePorPagina: number = 3
  totalPaginas: number = 1;
  prendasFiltradas: Prenda[] = [];
    imagenSeleccionada: string | null = null;


	constructor(private carritoService: CarritoService, private route: ActivatedRoute, private prendasService: PrendasService, private usuarioService: UsuarioService) {}

async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      try {
        this.producto = await this.prendasService.cargarPrenda(id);
        if (this.producto) {
          this.imagenSeleccionada = this.producto.imagenPrincipal || null;
        }
      } catch (e) {
        this.producto = null;
      }
    }
    this.cargando = false;
    this.obtenerUsuarioLogueado();
    this.esAdmin();
  }

  seleccionarImagen(img: string) {
    this.imagenSeleccionada = img;
  }

	volver() {
		history.back();
	}

	bajarCantidad() {
  if (this.cantidad > 1) {
    this.cantidad--;
  }
}
subirCantidad() {
  this.cantidad++;
}
async agregarAlCarrito() {
  this.mensajeExito = '';
  this.mensajeError = '';
  if (this.producto) {
    try {
      const disponible = await this.prendasService.verificarTalle(this.producto.id, this.talleSeleccionado, this.cantidad);
      if (!disponible) {
        this.mensajeError = 'No hay suficiente cantidad de ese talle';
        setTimeout(() => {
          this.mensajeError = '';
        }, 2000);
        return;
      }
      await this.carritoService.agregarAlCarrito(this.producto.id, this.cantidad, this.talleSeleccionado); 
      this.mensajeExito = 'Producto agregado al carrito correctamente';
      setTimeout(() => {
        this.mensajeExito = '';
      }, 2000); 
    } catch (e) {
      this.mensajeError = 'Error al agregar el producto al carrito';
      setTimeout(() => {
        this.mensajeError = '';
      }, 2000);
    }
  }
}

abrirGuiaTalles() {
    this.mostrarGuiaTalles = true;
  }

  cerrarGuiaTalles() {
    this.mostrarGuiaTalles = false;
  }

}
