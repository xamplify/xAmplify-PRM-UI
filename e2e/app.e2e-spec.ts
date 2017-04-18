import { XtremandWebCliPage } from './app.po';

describe('xtremand-web-cli App', () => {
  let page: XtremandWebCliPage;

  beforeEach(() => {
    page = new XtremandWebCliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
