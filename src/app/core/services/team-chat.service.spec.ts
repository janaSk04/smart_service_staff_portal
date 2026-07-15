import { TestBed } from '@angular/core/testing';

import { TeamChatService } from './team-chat.service';

describe('TeamChatService', () => {
  let service: TeamChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
