import { LeaseModule } from './lease.module';

describe('LeaseModule', () => {
  let leaseModule: LeaseModule;

  beforeEach(() => {
    leaseModule = new LeaseModule();
  });

  it('should create an instance', () => {
    expect(leaseModule).toBeTruthy();
  });
});
