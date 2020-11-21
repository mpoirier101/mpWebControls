/* Based on code by Chris Collins: https://github.com/scottishstoater/vanilla-calendar */
class mpCalendar {
  constructor(selector, options) {

    const me = this;
    this._element = document.getElementById(selector);
    this._element.classList.add("mpCal");

    this.options = options;
    var name = options.name || this._element.getAttribute("name") || selector;
    var caption = options.caption || this._element.getAttribute("caption") || "";
    var width = options.width || this._element.getAttribute("width") || "400px";
    var height = options.height || this._element.getAttribute("height") || "";
    this.disablePastDays = options.disablePastDays || this._element.getAttribute("disablePastDays") || "";

    // events
    this.clickHandler = this.onclick.bind(this);
    this.on = function (event, func) {
      this._element.addEventListener(event, func);
    };
    this.fireEvent = function (event, obj) {
      this._element.dispatchEvent(new CustomEvent(event, { detail: obj }));
    };

    this.todaysDate = new Date(new Date().toDateString());
    this.selectedDate = new Date(new Date().toDateString());
    this.date = new Date(new Date().toDateString());
    this.date.setDate(1);

    // calendar ctrl
    if (width) { this._element.style.width = width; }
    if (height) { this._element.style.height = height; }
    
    // hidden input for form
    this.input = this._element.appendChild(document.createElement("input"));
    this.input.type = "hidden";
    this.input.name = name;
    this.input.value = this.dateyyyymmdd(this.selectedDate);

    // calendar header
    var header = this._element.appendChild(document.createElement("header"));
    header.classList.add("mpCal-header","theme");

    // calendar weekdays
    var week = this._element.appendChild(document.createElement("div"));
    week.classList.add("mpCal-week", "theme2");

    // calendar month
    this.month = this._element.appendChild(document.createElement("content"));
    this.month.classList.add("mpCal-body");
    this.month.addEventListener('click', this.clickHandler, true);

    // add header controls
    var previous = header.appendChild(document.createElement("button"));
    previous.classList.add("mpCal-btn");
    previous.type = "button";
    previous.innerHTML = "&lt;";
    previous.value = -1;
    previous.style.cursor = "pointer";
    previous.onclick = function(e) {
      me.setCalendarMonth(e);
    }

    this.label = header.appendChild(document.createElement("div"));
    this.label.classList.add("mpCal-header__label");
    
    var next = header.appendChild(document.createElement("button"));
    next.classList.add("mpCal-btn");
    next.type = "button";
    next.innerHTML = "&gt;";
    next.value = 1;
    next.style.cursor = "pointer";
    next.onclick = function(e) {
      me.setCalendarMonth(e);
    }

    // week day names
    var weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    weekdays.forEach(day => {
      var w = week.appendChild(document.createElement("span"));
      w.innerText = day;
    });

    this.createMonth();
  }

  // Functions
  setCalendarMonth(e) {
    this.month.innerHTML = '';
    var val = Number.parseInt(e.target.value);
    this.date.setMonth(this.date.getMonth() + val);
    this.createMonth();
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
    this.date.setDate(this.date.getDate() - 1);
    this.date.setDate(1);
    this.label.innerHTML = this.monthsAsString(this.date.getMonth()) + ' ' + this.date.getFullYear();
  }

  createDay(num, day, year) {
    var newDay = document.createElement('div');
    newDay.innerHTML = num;
    newDay.classList.add('mpCal-date');
    // if it's the first day of the month
    if (num === 1) {
      if (day === 0) {
        newDay.style.marginLeft = (6 * 14.28) + '%';
      } else {
        newDay.style.marginLeft = ((day - 1) * 14.28) + '%';
      }
    }
    if (this.disablePastDays && this.date < this.todaysDate) {
      newDay.classList.add('mpCal-disabled');
    }
    if (this.date.valueOf() == this.todaysDate.valueOf()) {
      newDay.classList.add("theme2");
    }
    if (this.date.valueOf() == this.selectedDate.valueOf()) {
      newDay.classList.add("mpCal-selected");
    }
    this.month.appendChild(newDay);
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

  clearSelected() {
    var dates = this.month.querySelectorAll(".mpCal-date");
    dates.forEach(day => {
      day.classList.remove("mpCal-selected");
    })
  }

  dateyyyymmdd(date) {
		var yyyy = date.getFullYear();
		var mm = date.getMonth() + 1; // getMonth() is zero-based
		var dd = date.getDate();
		return [yyyy,
			(mm > 9 ? '' : '0') + mm,
			(dd > 9 ? '' : '0') + dd
		].join('-');
	}
}
mpCalendar.prototype.onclick = function (event) {
  event.stopImmediatePropagation();
  var day = event.target;
  if (day.textContent && !day.classList.contains("mpCal-disabled")) {
    this.clearSelected();
    day.classList.add("mpCal-selected");
    var date = Number.parseInt(day.textContent);
    this.selectedDate = new Date(this.date.toDateString());
    this.selectedDate.setDate(date);
    this.input.value = this.dateyyyymmdd(this.selectedDate);
    this.fireEvent("changed", this.dateyyyymmdd(this.selectedDate));
  }
}
