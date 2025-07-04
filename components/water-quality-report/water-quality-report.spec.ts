import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterQualityReport } from './water-quality-report';

describe('WaterQualityReport', () => {
  let component: WaterQualityReport;
  let fixture: ComponentFixture<WaterQualityReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaterQualityReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaterQualityReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
