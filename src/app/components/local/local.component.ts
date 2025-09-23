import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-local',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],

  templateUrl: './local.component.html',
  styleUrls: ['./local.component.css']
})

export class LocalComponent implements OnInit {
    
  ngOnInit(): void {
    
  }
}