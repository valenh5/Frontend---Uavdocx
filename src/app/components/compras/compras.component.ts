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
  styleUrl: './compras.component.css'
})
export class ComprasComponent {
  constructor(public usuarioService: UsuarioService, public compraService: CompraService) {  }
  compras: any[] = [];
  esAdminUsuario: boolean = false;

    esAdmin(): boolean {
    this.esAdminUsuario = this.usuarioService.esAdminDesdeToken();
    return this.esAdminUsuario;
  }

  ngOnInit(): void {
    this.esAdmin();
    this.cargarCompras();
  }

  async cargarCompras(): Promise<void> {
    try{
      this.compras = (await this.compraService.obtenerCompras()).data;
    }catch(error){
      console.error('Error al cargar las compras:', error);
    }
  }

  async modificarCompra(compra: any) {
  try {
    await this.compraService.modificarCompra(compra.id, compra);
    this.cargarCompras();
  } catch (error) {
    console.error('Error al modificar la compra:', error);
  }
}
}
