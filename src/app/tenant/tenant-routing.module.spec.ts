import { TenantRoutingModule } from './tenant-routing.module';

describe('TenantroutingModule', () => {
  let tenantroutingModule: TenantRoutingModule;

  beforeEach(() => {
    tenantroutingModule = new TenantRoutingModule();
  });

  it('should create an instance', () => {
    expect(tenantroutingModule).toBeTruthy();
  });
});
