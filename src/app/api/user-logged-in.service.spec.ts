import { TestBed } from '@angular/core/testing';

import { UserLoggedInService } from './user-logged-in.service';

describe('UserLoggedInService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserLoggedInService = TestBed.get(UserLoggedInService);
    expect(service).toBeTruthy();
  });
});
