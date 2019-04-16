import { TenantModule } from './tenant.module';

describe('TenantModule', () => {
  let tenantModule: TenantModule;

  beforeEach(() => {
    tenantModule = new TenantModule();
  });

  it('should create an instance', () => {
    expect(tenantModule).toBeTruthy();
  });
});
