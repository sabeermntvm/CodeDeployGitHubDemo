import { LeaseRoutingModule } from './lease-routing.module';

describe('LeaseRoutingModule', () => {
  let leaseRoutingModule: LeaseRoutingModule;

  beforeEach(() => {
    leaseRoutingModule = new LeaseRoutingModule();
  });

  it('should create an instance', () => {
    expect(leaseRoutingModule).toBeTruthy();
  });
});
