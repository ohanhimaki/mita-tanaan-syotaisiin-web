import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHandeditedComponent } from './manage-handedited.component';
import { MaterialModule } from 'src/app/shared/material.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ManageHandeditedComponent', () => {
  let component: ManageHandeditedComponent;
  let fixture: ComponentFixture<ManageHandeditedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MaterialModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule],
      declarations: [ManageHandeditedComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageHandeditedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
