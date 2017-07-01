import { OrderClientPage } from './app.po';

describe('order-client App', () => {
  let page: OrderClientPage;

  beforeEach(() => {
    page = new OrderClientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
