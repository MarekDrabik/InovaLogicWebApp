import { TestBed } from '@angular/core/testing';

import { FormSubmitionService } from './form-submition.service';

describe('FormSubmitionService', () => {
  let service: FormSubmitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormSubmitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
