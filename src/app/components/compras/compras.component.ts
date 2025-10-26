import { UsuarioService } from '../../servicios/usuario.service';
import { CompraService } from '../../servicios/compra.service';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-compras',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})
export class ComprasComponent {
  constructor(public usuarioService: UsuarioService, public compraService: CompraService) {  }
  compras: any[] = [];
  esAdminUsuario: boolean = false;
  page: number = 1;
  limit: number = 5;
  total: number = 0;

  mostrarTooltip(compra: any) {
    this.compras.forEach(c => c.mostrarTooltip = false);
    compra.mostrarTooltip = true;
  }

  ocultarTooltip(compra: any) {
    compra.mostrarTooltip = false;
  }

  async cancelarCompra(compra: any) {
    compra.estado = 'cancelada';
    compra.mostrarTooltip = false;
    await this.modificarCompra(compra);
  }

  esAdmin(): boolean {
    this.esAdminUsuario = this.usuarioService.esAdminDesdeToken();
    return this.esAdminUsuario;
  }

  ngOnInit(): void {
    this.esAdmin();
    this.cargarCompras();
  }

  async cargarCompras(): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      const response = await this.compraService.obtenerComprasPaginadas(this.page, this.limit, token);
      const res = response.data;
      if (res && res.data) {
        this.compras = res.data;
        this.total = res.total;
        this.page = res.page;
        this.limit = res.limit;
      } else {
        this.compras = Array.isArray(res) ? res : [];
        this.total = this.compras.length;
      }
    } catch (error) {
      console.error('Error al cargar las compras:', error);
    }
  }

  totalPaginas(): number {
    return Math.max(1, Math.ceil(this.total / this.limit));
  }

  async cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas() || nuevaPagina === this.page) return;
    this.page = nuevaPagina;
    await this.cargarCompras();
  }

  async modificarCompra(compra: any) {
    try {
      await this.compraService.modificarCompra(compra.id, compra);
      await this.cargarCompras();
    } catch (error) {
      console.error('Error al modificar la compra:', error);
    }
  }

  async onFechaEntregaChange(compra: any, nuevaFecha: string) {
    const fechaISO = new Date(nuevaFecha).toISOString();
    compra.fechaEntrega = fechaISO;
    compra.estado = 'entregada';
    await this.modificarCompra(compra);
  }

  async verificarPendientes() {
    try {
      await this.compraService.verificarPendientes();
      await this.cargarCompras();
    } catch (error) {
      console.error('Error al verificar compras pendientes:', error);
    }
  }
}
