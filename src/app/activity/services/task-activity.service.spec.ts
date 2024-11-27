import { TestBed, inject } from '@angular/core/testing';

import { TaskActivityService } from './task-activity.service';

describe('TaskActivityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskActivityService]
    });
  });

  it('should be created', inject([TaskActivityService], (service: TaskActivityService) => {
    expect(service).toBeTruthy();
  }));
});
