

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PrendasService } from '../../servicios/prenda.service';
import { Prenda } from '../../modelos/prenda';
import { CarritoService } from '../../servicios/carrito.service';

@Component({
	selector: 'app-producto-detalle',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './producto.component.html',
	styleUrls: ['./producto.component.css']
})
export class ProductoDetalleComponent implements OnInit {
	mostrarGuiaTalles = false;

	abrirGuiaTalles() {
		this.mostrarGuiaTalles = true;
	}

	cerrarGuiaTalles() {
		this.mostrarGuiaTalles = false;
	}
	producto: Prenda | null = null;
	cargando: boolean = true;

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
 async agregarAlCarrito() {
    if (this.producto) {
      try {
        await this.carritoService.agregarAlCarrito(this.producto.id, 1);
        alert('Producto agregado al carrito');
      } catch (e) {
        alert('Error al agregar el producto al carrito');
      }
    }   
}
}
