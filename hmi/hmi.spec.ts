import { ComponentFixture, TestBed } from '@angular/core/testing';

import { hmi } from './hmi';

describe('Hmi', () => {
  let component: hmi;
  let fixture: ComponentFixture<hmi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [hmi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(hmi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
