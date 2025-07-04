import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterQualityChart } from './water-quality-chart';

describe('WaterQualityChart', () => {
  let component: WaterQualityChart;
  let fixture: ComponentFixture<WaterQualityChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterQualityChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterQualityChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
