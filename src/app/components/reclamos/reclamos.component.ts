import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReclamoService } from '../../servicios/reclamo.service';

@Component({
  selector: 'app-reclamos',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './reclamos.component.html',
  styleUrls: ['./reclamos.component.css']
})
export class ReclamosComponent implements OnInit {
  reclamos: any[] = [];
    esAdmin: boolean = false;
    constructor(private reclamoService: ReclamoService) {}
    async ngOnInit() {
        this.esAdmin = localStorage.getItem('esAdmin') === 'true';
        if (this.esAdmin) {
            await this.cargarReclamos();
        }
    }

  async cargarReclamos() {
    try {
      this.reclamos = await this.reclamoService.getReclamos();
    } catch (error) {
      console.error('Error al cargar reclamos:', error);
    }
  }
  async eliminarReclamo(id: number) {
    try {
      await this.reclamoService.eliminarReclamo(id);
      await this.cargarReclamos();
    } catch (error) {
      console.error('Error al eliminar reclamo:', error);
    }
    }
    async modificarReclamo(reclamo: any) {
        try {
            await this.reclamoService.actualizarReclamo(reclamo);
            await this.cargarReclamos();
        } catch (error) {
            console.error('Error al modificar reclamo:', error);
        }
    }
}
