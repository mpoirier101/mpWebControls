class mpCalendar {

  constructor(selector, options) {

    const me = this;
    this._element = document.getElementById(selector);
    this.options = options;

    var weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    this.header = this._element.appendChild(document.createElement("div"));
    this.previous = this.header.appendChild(document.createElement("div"));
    this.label = this.header.appendChild(document.createElement("div"));
    this.next = this.header.appendChild(document.createElement("div"));
    this.week = this._element.appendChild(document.createElement("div"));
    this.month = this._element.appendChild(document.createElement("div"));

    weekdays.forEach(day => {
      var w = this.week.appendChild(document.createElement("span"));
      w.innerText = day;
    });

    this.header.classList.add("vcal-header");
    this.previous.classList.add("vcal-btn");
    this.label.classList.add("vcal-header__label");
    this.next.classList.add("vcal-btn");
    this.week.classList.add("vcal-week", "sm");
    this.month.classList.add("vcal-body");

    this.activeDates = null;
    this.date = new Date();
    this.todaysDate = new Date();

    this.date.setDate(1);
    this.createMonth();
    this.createListeners();
  }

  // Functions

  createListeners() {
    var _this = this
    this.next.addEventListener('click', function () {
      _this.clearCalendar();
      var nextMonth = _this.date.getMonth() + 1;
      _this.date.setMonth(nextMonth);
      _this.createMonth();
    })
    // Clears the calendar and shows the previous month
    this.previous.addEventListener('click', function () {
      _this.clearCalendar();
      var prevMonth = _this.date.getMonth() - 1;
      _this.date.setMonth(prevMonth);
      _this.createMonth();
    })
  }

  createDay(num, day, year) {
    var newDay = document.createElement('div');
    var dateEl = document.createElement('span');
    dateEl.innerHTML = num;
    newDay.className = 'vcal-date';
    newDay.setAttribute('data-calendar-date', this.date);

    // if it's the first day of the month
    if (num === 1) {
      if (day === 0) {
        newDay.style.marginLeft = (6 * 14.28) + '%';
      } else {
        newDay.style.marginLeft = ((day - 1) * 14.28) + '%';
      }
    }

    if (this.options.disablePastDays && this.date.getTime() <= this.todaysDate.getTime() - 1) {
      newDay.classList.add('vcal-date--disabled');
    } else {
      newDay.classList.add('vcal-date--active');
      newDay.setAttribute('data-calendar-status', 'active');
    }

    if (this.date.toString() === this.todaysDate.toString()) {
      newDay.classList.add('vcal-date--today');
    }

    newDay.appendChild(dateEl);
    this.month.appendChild(newDay);
  }

  dateClicked() {
    var _this = this;
    this.activeDates = document.querySelectorAll('[data-calendar-status="active"]');
    for (var i = 0; i < this.activeDates.length; i++) {
      this.activeDates[i].addEventListener('click', function (event) {
        //var picked = document.querySelectorAll('[data-calendar-label="picked"]')[0];
        //picked.innerHTML = this.dataset.calendarDate;
        _this.removeActiveClass();
        this.classList.add('vcal-date--selected');
      })
    }
  }

  createMonth() {
    var currentMonth = this.date.getMonth();
    while (this.date.getMonth() === currentMonth) {
      this.createDay(
        this.date.getDate(),
        this.date.getDay(),
        this.date.getFullYear()
      );
      this.date.setDate(this.date.getDate() + 1);
    }
    // while loop trips over and day is at 30/31, bring it back
    this.date.setDate(1);
    this.date.setMonth(this.date.getMonth() - 1);

    this.label.innerHTML = this.monthsAsString(this.date.getMonth()) + ' ' + this.date.getFullYear();
    this.dateClicked();
  }

  monthsAsString(monthIndex) {
    return [
      'January',
      'Febuary',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ][monthIndex];
  }

  clearCalendar() {
    mpCalendar.month.innerHTML = '';
  }

  removeActiveClass() {
    for (var i = 0; i < this.activeDates.length; i++) {
      this.activeDates[i].classList.remove('vcal-date--selected');
    }
  }
}