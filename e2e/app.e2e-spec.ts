import { BasePage } from './app.po';
import { browser } from 'protractor';

describe('xamplify-prm-ui App', () => {
  let page: BasePage;

  beforeEach(() => {
    page = new BasePage();
  });

  it('should display message saying Experience the new way of ecosystem marketing', () => {
    page.navigateTo();
    expect(page.getHeaderText()).toEqual('Experience the new way of ecosystem marketing');
  });

});
