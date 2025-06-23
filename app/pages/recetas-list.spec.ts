import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetasList } from './recetas-list';

describe('RecetasList', () => {
  let component: RecetasList;
  let fixture: ComponentFixture<RecetasList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecetasList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetasList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
