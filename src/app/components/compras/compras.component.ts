import { Component } from '@angular/core';
import { UsuarioService } from '../../servicios/usuario.service';
import { CompraService } from '../../servicios/compra.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compras',
  imports: [CommonModule],
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
}
