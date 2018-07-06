import { BasePage } from './app.po';
import { browser } from 'protractor';

describe('xtremand-web-cli App', () => {
  let page: BasePage;

  beforeEach(() => {
    page = new BasePage();
  });

  it('should display message saying Experience the new way of ecosystem marketing', () => {
    page.navigateTo();
    expect(page.getHeaderText()).toEqual('Experience the new way of ecosystem marketing');
  });

});
