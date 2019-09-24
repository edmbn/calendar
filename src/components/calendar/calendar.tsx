import { Component, Prop, h, Element, State } from '@stencil/core';

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

  /**
   * Component element in DOM
   */
  @Element() element: HTMLElement;

  monthHeader: string;

  @State() startDate: any;
  @State() endDate: any;
  monthObject: any[];
  monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];

  componentWillLoad() {
    this.getMonthView();
  }
  componentWillUpdate() {
    this.getMonthView();
  }

  componentDidUpdate() {}

  private getMonthView() {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    if (this.year != undefined) {
      date.setFullYear(this.year);
    }
    if (this.month != undefined) {
      date.setMonth(this.month);
    }
    return this.getMonthWeeks(date);
  }

  private getMonthWeeks(date: Date) {
    const monthObject = [];
    const month = date.getMonth();
    this.month = month;
    this.year = date.getFullYear();
    let week = 0;
    let lastWeekDay;
    const currentMonthDay = date.getDate();
    date.setDate(1);
    this.monthHeader = `${this.monthNames[date.getMonth()]} ${date.getFullYear()}`;
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
    this.monthObject = monthObject;
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

  handleDayClick(timestamp: number) {
    if (!timestamp) {
      return;
    }
    if ((this.startDate && this.endDate) || (this.startDate && timestamp < this.startDate)) {
      this.startDate = null;
      this.endDate = null;
    }
    if (!this.startDate) {
      this.startDate = timestamp;
    } else if (!this.endDate) {
      if (timestamp === this.startDate) {
        this.startDate = this.startDate;
      } else {
        this.endDate = timestamp;
      }
    }
  }

  changeMonth(direction: string) {
    if (direction === 'next') {
      this.month += 1;
    } else {
      this.month -= 1;
    }
  }

  getSelectionStyles(timestamp) {
    const elementTime = parseInt(timestamp);
    let selectionStyles = '';
    if (!this.startDate && !this.endDate) {
      return selectionStyles;
    }
    if (this.startDate) {
      if (elementTime === this.startDate) {
        selectionStyles = 'start-date';
      }
    }
    if (this.endDate) {
      if (elementTime === this.endDate) {
        selectionStyles = 'end-date';
      }
    }
    if (this.startDate && this.endDate && (elementTime >= this.startDate && elementTime <= this.endDate)) {
      selectionStyles = `${selectionStyles} selected-date`;
    }
    return selectionStyles;
  }

  render() {
    return (
      <div class='flex flex-col items-center'>
        <header class='flex justify-between items-center w-4/5'>
          <svg
            class='w-1/6 max-w-2'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 512 512'
            onClick={() => {
              this.changeMonth('previous');
            }}
          >
            <path d='M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z' />
          </svg>
          <span>{this.monthHeader}</span>
          <svg
            class='w-1/6 max-w-2'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 512 512'
            onClick={() => {
              this.changeMonth('next');
            }}
          >
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
          {this.monthObject.map(week => (
            <ul class='flex'>
              {week.map(day => (
                <li
                  data-time={day ? day.timestamp : false}
                  class={`w-1/7 flex justify-center items-center day outline-none ${
                    day ? this.getSelectionStyles(day.timestamp) : ''
                  }`}
                >
                  <button
                    disabled={!day}
                    class='w-full h-full flex items-center justify-center'
                    onClick={() => {
                      this.handleDayClick(day.timestamp);
                    }}
                  >
                    <span class={`day-text rounded-full`}>{day ? day.number : ''}</span>
                  </button>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    );
  }
}
