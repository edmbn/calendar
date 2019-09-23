import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'edmbn-calendar',
  styleUrl: 'calendar.css',
  shadow: true
})
export class Calendar {
  /**
   * Calendar year
   */
  @Prop() year: number;

  /**
   * Calendar month
   */
  @Prop() month: number;

  /**
   * Calendar locale
   */
  @Prop() locale;

  /**
   * Type of calendar
   */
  @Prop() type = 'range';

  startDate: any;
  endDate: any;
  selectedElements: any[];

  private getMonthView() {
    const date = new Date();
    if (this.year) {
      date.setFullYear(this.year);
    }
    if (this.month) {
      date.setMonth(this.month);
    }
    return this.getMonthWeeks(date);
  }

  private getMonthWeeks(date: Date) {
    const monthObject = [];
    const month = date.getMonth();
    let week = 0;
    let lastWeekDay;
    const currentMonthDay = date.getDate();
    date.setDate(1);
    for (let monthDay = 1; month === date.getMonth(); monthDay++) {
      const currentweekDay = this.getWeekDayByLocation(date.getDay());
      if (lastWeekDay && lastWeekDay > currentweekDay) {
        week++;
      }
      const day = {
        number: monthDay,
        timestamp: date.getTime(),
        currentDay: date.getDate() === currentMonthDay
      };
      if (monthObject[week]) {
        monthObject[week][currentweekDay] = day;
      } else {
        monthObject[week] = Array.apply(null, Array(7));
        monthObject[week][currentweekDay] = day;
      }
      lastWeekDay = currentweekDay;
      date.setDate(monthDay + 1);
    }
    return monthObject;
  }

  getWeekDayByLocation(weekDay: number) {
    switch (this.locale) {
      default:
      case 'es': {
        if (weekDay === 0) {
          return 6;
        } else {
          return (weekDay -= 1);
        }
      }
    }
  }

  resetCalendarSelection() {
    if (this.selectedElements) {
      this.selectedElements.forEach(el => {
        el.classList.remove('selected-date', 'start-item', 'end-item');
        if (el.firstChild.classList.contains('start-date') || el.firstChild.classList.contains('end-date')) {
          el.firstChild.classList.remove('start-date', 'end-date');
        }
      });
      this.selectedElements = [];
    }
    if (this.startDate) {
      this.startDate.element.classList.remove('start-date');
      this.startDate = null;
    }
    if (this.endDate) {
      this.endDate.element.classList.remove('end-date');
      this.endDate = null;
    }
  }

  selectRangeDays() {
    const calendarElements = Array.from(document.querySelector('edmbn-calendar').shadowRoot.querySelectorAll('.day'));
    const startDayElement = calendarElements.find((el: any) => el.firstChild.classList.contains('start-date'));
    const startDayIndex = calendarElements.indexOf(startDayElement);
    const endDayElement = calendarElements.find((el: any) => el.firstChild.classList.contains('end-date'));
    const endDayIndex = calendarElements.indexOf(endDayElement);

    startDayElement.classList.add('start-item');
    endDayElement.classList.add('end-item');
    this.selectedElements = calendarElements.slice(startDayIndex, endDayIndex + 1);
    this.selectedElements.forEach(el => el.classList.add('selected-date'));
  }

  handleDayClick(event, timestamp: number) {
    if (this.startDate && this.endDate) {
      this.resetCalendarSelection();
    } else if (this.startDate && timestamp < this.startDate.timestamp) {
      this.resetCalendarSelection();
    }

    if (!this.startDate) {
      const startElement = event.composedPath()[0];
      startElement.classList.add('start-date');
      this.startDate = { element: startElement, timestamp };
    } else if (!this.endDate) {
      const endElement = event.composedPath()[0];
      endElement.classList.add('end-date');
      this.endDate = { element: endElement, timestamp };
      this.selectRangeDays();
    }
  }

  render() {
    return (
      <div class='flex flex-col items-center'>
        <header class='flex justify-between items-center w-4/5'>
          <svg class='w-1/6 max-w-2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
            <path d='M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z' />
          </svg>
          <span>MONTH</span>
          <svg class='w-1/6 max-w-2' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
            <path d='M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z' />
          </svg>
        </header>

        <ul class='flex w-full mt-8'>
          <li class='w-1/7 flex justify-center'>Lun</li>
          <li class='w-1/7 flex justify-center'>Mar</li>
          <li class='w-1/7 flex justify-center'>Mie</li>
          <li class='w-1/7 flex justify-center'>Jue</li>
          <li class='w-1/7 flex justify-center'>Vie</li>
          <li class='w-1/7 flex justify-center'>Sab</li>
          <li class='w-1/7 flex justify-center'>Dom</li>
        </ul>
        <div class='flex flex-col w-full'>
          {this.getMonthView().map(week => (
            <ul class='flex'>
              {week.map(day => (
                <li class={`w-1/7 flex justify-center items-center day`}>
                  <span
                    onClick={event => {
                      this.handleDayClick(event, day.timestamp);
                    }}
                    class={`day-text rounded-full`}
                  >
                    {day ? day.number : ''}
                  </span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    );
  }
}
