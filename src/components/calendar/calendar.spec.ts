import { TestWindow } from '@stencil/core/testing';
import { Calendar } from './calendar';

describe('calendar', () => {
  it('should build', () => {
    expect(new Calendar()).toBeTruthy();
  });

  describe('rendering', () => {
    let element: HTMLCalendarElement;
    let testWindow: TestWindow;
    beforeEach(async () => {
      testWindow = new TestWindow();
      element = await testWindow.load({
        components: [Calendar],
        html: '<calendar></calendar>'
      });
    });

    // See https://stenciljs.com/docs/unit-testing
    {cursor}

  });
});
