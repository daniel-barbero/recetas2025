import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetaEdicion } from './receta-edicion';

describe('RecetaEdicion', () => {
  let component: RecetaEdicion;
  let fixture: ComponentFixture<RecetaEdicion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetaEdicion]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetaEdicion);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
