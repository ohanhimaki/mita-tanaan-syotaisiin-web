
import { NativeDateAdapter } from '@angular/material';
import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Injectable()
export class FinnishDateAdapter extends NativeDateAdapter {
  constructor() {
    super('fi', new Platform());
  }

  getFirstDayOfWeek(): number {
    return 1;
  }
}
