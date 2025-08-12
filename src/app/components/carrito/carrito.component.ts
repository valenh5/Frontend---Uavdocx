import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [FormsModule], 
  templateUrl: './carrito.component.html',
})
export class CarritoComponent implements OnInit{
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

}

