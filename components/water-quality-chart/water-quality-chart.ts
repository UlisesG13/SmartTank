import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebSocketService } from '../../services/web-socket-service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);


interface WaterSensorData {
  ph: number[];
  turbidity: number[];
  timestamps: string[];

  }
@Component({
  selector: 'app-water-quality-chart',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './water-quality-chart.html',
  styleUrl: './water-quality-chart.scss'
})

export class WaterQualityChart implements AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;

  private sensorData: WaterSensorData = {
    ph: [],
    turbidity: [],
    timestamps: []
  };

  // Datos para las métricas
  public alertsPercentage: number = 15;
  public lostDealsPercentage: number = 4;
  public waterQualityPercentage: number = 84;

  // Datos para el gráfico circular
  public circularProgress: number = 0;

  constructor(private webSocketService: WebSocketService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createChart();
      this.animateCircularProgress();
      this.connectToWebSocket();
    }, 0);
  }

  private connectToWebSocket() {
    this.webSocketService.getMessages().subscribe((data) => {
      // Assuming data is of type SensorMessage with properties 'name' and 'data'
      const name = (data as any).name;
      const sensorData = (data as any).data;

      if (!name || !sensorData) {
        console.warn('Datos inválidos recibidos:', data);
        return;
      }

      switch (name) {
        case 'pH Sensor':
          this.handlePhSensor(sensorData);
          break;
        case 'Turbidity Sensor':
          this.handleTurbiditySensor(sensorData);
          break;
        default:
          console.log('Sensor no reconocido:', name);
          break;
      }
    });
  }

  private handlePhSensor(data: any) {
    const phValue = data.ph || data.data?.ph || data.value;
    if (phValue !== undefined) {
      this.sensorData.ph.push(phValue);
      if (this.sensorData.ph.length > 12) {
        this.sensorData.ph.shift();
      }
      this.updateChart();
      this.calculateWaterQuality();
    }
  }

  private handleTurbiditySensor(data: any) {
    const turbidityValue = data.turbidity || data.data?.turbidity || data.value;
    if (turbidityValue !== undefined) {
      this.sensorData.turbidity.push(turbidityValue);
      if (this.sensorData.turbidity.length > 12) {
        this.sensorData.turbidity.shift();
      }
      this.updateChart();
      this.calculateWaterQuality();
    }
  }

  private createChart() {
    if (!this.chartCanvas?.nativeElement) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'],
        datasets: [
          {
            label: 'pH',
            data: [450, 700, 600, 650, 480, 800, 900, 400, 850, 750, 950, 1000],
            backgroundColor: '#6366f1',
            borderColor: '#6366f1',
            borderRadius: 4,
            barPercentage: 0.6,
            categoryPercentage: 0.8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            align: 'end',
            labels: {
              color: '#6366f1',
              font: {
                size: 12,
                weight: 'normal'
              },
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#fff',
            bodyColor: '#fff',
            cornerRadius: 6,
            displayColors: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 1000,
            ticks: {
              stepSize: 200,
              color: '#9ca3af',
              font: {
                size: 11
              },
              callback: function(value) {
                return value;
              }
            },
            grid: {
              color: '#f3f4f6',
              lineWidth: 1
            }
          },
          x: {
            ticks: {
              color: '#9ca3af',
              font: {
                size: 11
              }
            },
            grid: {
              display: false
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart() {
    if (!this.chart) return;

    // Actualizar datos del gráfico con los últimos valores de los sensores
    if (this.sensorData.ph.length > 0) {
      // Simular datos basados en los valores reales de pH
      const phData = this.sensorData.ph.slice(-12); // Últimos 12 valores
      const scaledData = phData.map(value => value * 100); // Escalar para visualización
      
      this.chart.data.datasets[0].data = scaledData;
      this.chart.update('none'); // Actualización sin animación para mejor rendimiento
    }
  }

  private calculateWaterQuality() {
    if (this.sensorData.ph.length === 0 && this.sensorData.turbidity.length === 0) return;

    // Calcular calidad del agua basada en pH y turbidez
    const avgPh = this.sensorData.ph.length > 0 ? 
      this.sensorData.ph.reduce((a, b) => a + b, 0) / this.sensorData.ph.length : 7;
    
    const avgTurbidity = this.sensorData.turbidity.length > 0 ? 
      this.sensorData.turbidity.reduce((a, b) => a + b, 0) / this.sensorData.turbidity.length : 0;

    // Calcular porcentaje de calidad (ejemplo de lógica)
    let quality = 100;
    
    // Penalizar si el pH está fuera del rango ideal (6.5-8.5)
    if (avgPh < 6.5 || avgPh > 8.5) {
      quality -= Math.abs(avgPh - 7) * 10;
    }
    
    // Penalizar por turbidez alta
    if (avgTurbidity > 1) {
      quality -= avgTurbidity * 5;
    }

    this.waterQualityPercentage = Math.max(0, Math.min(100, Math.round(quality)));
    
    // Actualizar alertas basadas en la calidad
    this.alertsPercentage = this.waterQualityPercentage < 70 ? 25 : 15;
    this.lostDealsPercentage = this.waterQualityPercentage < 60 ? 8 : 4;
  }

  private animateCircularProgress() {
    const targetProgress = this.waterQualityPercentage;
    const duration = 1000; // 1 segundo
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      this.circularProgress = progress * targetProgress;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  // Método para obtener el offset del stroke del círculo
  getStrokeDashoffset(): number {
    const circumference = 2 * Math.PI * 52; // radio = 52
    return circumference - (circumference * this.circularProgress / 100);
  }

  // Método para obtener el color del trend
  getTrendColor(): string {
    return this.alertsPercentage > 20 ? '#ef4444' : '#10b981';
  }
}
