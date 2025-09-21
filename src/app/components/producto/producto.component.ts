

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrendasService } from '../../servicios/prenda.service';
import { Prenda } from '../../modelos/prenda';
import { CarritoService } from '../../servicios/carrito.service';
import { FormsModule } from '@angular/forms';

@Component({
	selector: 'app-producto-detalle',
	standalone: true,
	imports: [CommonModule, FormsModule],
	templateUrl: './producto.component.html',
	styleUrls: ['./producto.component.css']
})
export class ProductoDetalleComponent implements OnInit {
	mostrarGuiaTalles = false;
	talleSeleccionado: string = '';

	abrirGuiaTalles() {
		this.mostrarGuiaTalles = true;
	}

	cerrarGuiaTalles() {
		this.mostrarGuiaTalles = false;
	}
	producto: Prenda | null = null;
	cargando: boolean = true;
	mensajeExito: string = '';
  mensajeError: string = '';
  cantidad: number = 1;

	constructor(private carritoService: CarritoService, private route: ActivatedRoute, private prendasService: PrendasService) {}

	async ngOnInit() {
		const id = Number(this.route.snapshot.paramMap.get('id'));
		if (id) {
			try {
				this.producto = await this.prendasService.cargarPrenda(id);
			} catch (e) {
				this.producto = null;
			}
		}
		this.cargando = false;
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
      await this.carritoService.agregarAlCarrito(this.producto.id, this.cantidad, this.talleSeleccionado); // <-- talle agregado
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
}
