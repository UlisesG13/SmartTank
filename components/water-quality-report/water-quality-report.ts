import { AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import { WebSocketService } from '../../services/web-socket-service';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js';


@Component({
  selector: 'app-water-quality-report',
  imports: [CommonModule],
  templateUrl: './water-quality-report.html',
  styleUrl: './water-quality-report.scss'
})
export class WaterQualityReport implements AfterViewInit{
  @ViewChild('chartCanvas') chartCanvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('qualityCanvas') qualityCanvas?: ElementRef<HTMLCanvasElement>;
  
  private chart?: Chart;
  private qualityChart: any;

  private sensorData: { [key: string]: any } = {
    'pH Sensor 1': { value: [] },
    'pH Sensor 2': { value: [] }
  };

  // Métricas para las tarjetas
  public alerts = 15;
  public alertsTrend = 'up'; // 'up' o 'down'
  public lostDeals = 4;
  public waterQuality = 84;

  // Datos para el gráfico semanal
  private weeklyLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  private weeklyData = [1800, 1900, 2000, 2200, 1900, 2100, 2000];

  constructor(private webSocketService: WebSocketService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.createChart();
      this.createQualityChart();
      
      // Suscribirse a los datos del WebSocket
      this.webSocketService.getMessages().subscribe((msg) => {
        // msg: SensorMessage { sensor: string, data: { [key: string]: any }, date: string }
        const name = msg.sensor;
        const sensorData = msg.data;

        if (!name || !sensorData) {
          console.warn('Datos inválidos recibidos:', msg);
          return;
        }

        switch (name) {
          case 'pH Sensor 1':
            if (!this.sensorData[name]) this.sensorData[name] = { value: [] };
            this.sensorData[name].value.push(sensorData['pH'] ?? sensorData['value'] ?? sensorData);
            if (this.sensorData[name].value.length > 10) {
              this.sensorData[name].value.shift();
            }
            break;
          case 'pH Sensor 2':
            if (!this.sensorData[name]) this.sensorData[name] = { value: [] };
            this.sensorData[name].value.push(sensorData['pH'] ?? sensorData['value'] ?? sensorData);
            if (this.sensorData[name].value.length > 10) {
              this.sensorData[name].value.shift();
            }
            break;
          default:
            break;
        }

        this.updateChart();
        this.updateMetrics();
      });
    }, 0);
  }

  private createChart() {
    if (!this.chartCanvas?.nativeElement) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.weeklyLabels,
        datasets: [{
          label: 'pH Level',
          data: this.weeklyData,
          borderColor: '#22d3ee',
          backgroundColor: 'rgba(34, 211, 238, 0.1)',
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#22d3ee',
          pointBorderColor: '#ffffff',
          pointBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#9ca3af',
              font: {
                size: 12
              }
            }
          },
          y: {
            beginAtZero: false,
            min: 1000,
            max: 3000,
            grid: {
              color: '#f3f4f6'
            },
            ticks: {
              color: '#9ca3af',
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }

  private createQualityChart() {
    if (!this.qualityCanvas?.nativeElement) return;

    const ctx = this.qualityCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    this.qualityChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.waterQuality, 100 - this.waterQuality],
          backgroundColor: ['#fbbf24', '#f3f4f6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        rotation: Math.PI,
        circumference: 2 * Math.PI,
        cutout: '80%',
        plugins: {
          legend: {
            display: false
          }
        }
      } as any
    });
  }

  private updateChart() {
    if (!this.chart) return;

    // Actualizar con datos reales de los sensores si están disponibles
    if (this.sensorData['pH Sensor 1']?.value?.length > 0) {
      const latestData = this.sensorData['pH Sensor 1'].value.slice(-7);
      if (latestData.length === 7) {
        this.chart.data.datasets[0].data = latestData;
        this.chart.update('none');
      }
    }
  }

  private updateMetrics() {
    // Actualizar métricas basadas en los datos de los sensores
    const sensor1Data = this.sensorData['pH Sensor 1']?.value || [];
    const sensor2Data = this.sensorData['pH Sensor 2']?.value || [];
    
    if (sensor1Data.length > 0 || sensor2Data.length > 0) {
      // Calcular alertas basadas en valores pH fuera del rango óptimo (6.5-8.5)
      const allValues = [...sensor1Data, ...sensor2Data];
      const alertCount = allValues.filter(value => value < 6.5 || value > 8.5).length;
      
      if (alertCount !== this.alerts) {
        this.alertsTrend = alertCount > this.alerts ? 'up' : 'down';
        this.alerts = alertCount;
      }
      
      // Calcular calidad del agua basada en el promedio de pH
      const avgPH = allValues.reduce((sum, val) => sum + val, 0) / allValues.length;
      if (avgPH >= 6.5 && avgPH <= 8.5) {
        this.waterQuality = Math.min(100, Math.floor(85 + (Math.random() * 15)));
      } else {
        this.waterQuality = Math.max(60, Math.floor(75 - Math.abs(avgPH - 7.0) * 10));
      }
      
      // Actualizar gráfico de calidad
      if (this.qualityChart) {
        this.qualityChart.data.datasets[0].data = [this.waterQuality, 100 - this.waterQuality];
        this.qualityChart.update('none');
      }
    }
  }

  getTrendIcon(): string {
    return this.alertsTrend === 'up' ? '↗' : '↘';
  }

  getTrendColor(): string {
    return this.alertsTrend === 'up' ? '#ef4444' : '#10b981';
  }

  getQualityColor(): string {
    if (this.waterQuality >= 80) return '#10b981';
    if (this.waterQuality >= 60) return '#f59e0b';
    return '#ef4444';
  }
}
