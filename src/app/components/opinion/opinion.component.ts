import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { OpinionService } from '../../servicios/opinion.service';

@Component({
  selector: 'app-opinion',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './opinion.component.html',
  styleUrls: ['./opinion.component.css']
})
export class OpinionComponent implements OnInit {
  compra: any = null;

  constructor(private route: ActivatedRoute, private opinionService: OpinionService) {}
  calificacion: number = 0;
  comentario: string = '';
  mensajeExiste = '';

  ngOnInit(): void {
    this.compra = history.state.compra;
  }



  async enviarOpinion(): Promise<void> {
    const existe = await this.opinionService.verificarExistencia(this.compra.id);
    if (!existe){
    const opinion = {
      id_compra: this.compra.id,
      calificacion: this.calificacion,
      comentario: this.comentario
    };
    await this.opinionService.crearOpinion(opinion as any);
    }else{
        this.mensajeExiste = 'Ya existe una opinion para esta compra.';
        setTimeout(() => {
          this.mensajeExiste = '';
        }, 2000);
        return;
    }

  }
}