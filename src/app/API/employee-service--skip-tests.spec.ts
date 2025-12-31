import { TestBed } from '@angular/core/testing';

import { EmployeeServiceSkipTests } from './employee-service--skip-tests';

describe('EmployeeServiceSkipTests', () => {
  let service: EmployeeServiceSkipTests;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeServiceSkipTests);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
