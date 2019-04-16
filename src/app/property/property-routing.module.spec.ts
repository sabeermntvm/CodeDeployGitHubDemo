import { PropertyRoutingModule } from './property-routing.module';

describe('PropertyRoutingModule', () => {
  let propertyRoutingModule: PropertyRoutingModule;

  beforeEach(() => {
    propertyRoutingModule = new PropertyRoutingModule();
  });

  it('should create an instance', () => {
    expect(propertyRoutingModule).toBeTruthy();
  });
});
