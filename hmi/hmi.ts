import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hmi',
  imports: [CommonModule],
  templateUrl: './hmi.html',
  styleUrl: './hmi.scss'
})
export class hmi implements OnInit{
   nivelAgua = 80;
  ph = 7;
  turbidez = 2;
  conductividad = 600;
  bombaActiva = false;

  ngOnInit(): void {
    setInterval(() => {
      this.simularDatos();
    }, 2500); 
  }

  simularDatos() {
    this.nivelAgua = this.random(30, 100);
    this.ph = this.random(5.5, 8.5);
    this.turbidez = this.random(1, 10);
    this.conductividad = this.random(100, 1500);

    this.bombaActiva = this.ph < 6 || this.ph > 8 || this.turbidez > 7;
  }

  random(min: number, max: number): number {
    return +(Math.random() * (max - min) + min).toFixed(2);
  }
}
