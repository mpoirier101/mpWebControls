class mpDateRange {
  constructor(selector, options) {

    this._element = document.getElementById(selector);
    this._element.classList.add("mpControl");

    this.options = options;
    var placeholders = options.placeholders || (this._element.getAttribute("placeholders") || "").split(',');
    var captions = options.captions || (this._element.getAttribute("captions") || "First,Last").split(',');
    var pattern = options.pattern || this._element.getAttribute("pattern") || "\d{4}-\d{2}-\d{2}";
    var values = options.values || (this._element.getAttribute("values") || "").split(',');
    var required = options.required || this._element.getAttribute("required") || "";

    // events
    this.inputHandler = this.oninput.bind(this);
    this.on = function (event, func) {
      this._element.addEventListener(event, func);
    };
    this.fireEvent = function (event, obj) {
      this._element.dispatchEvent(new CustomEvent(event, { detail: obj }));
    };


    // control wrapper
    var wrapper = this._element.appendChild(document.createElement("div"));
    wrapper.classList.add("mpControl-nowrap");
    
    // start control
    if (captions[0]) {
      var lbl = wrapper.appendChild(document.createElement("div"));
      lbl.classList.add("mpControl-label");
      lbl.innerText = captions[0];
    }
    var wrapperStart = wrapper.appendChild(document.createElement("div"));
    wrapperStart.classList.add("mpControl-wrapper");
    // input start control
    this.start = wrapperStart.appendChild(document.createElement("input"));
    this.start.type = "date";
    this.start.id = selector + "start";
    this.start.name = selector + "start";
    if (placeholders[0]) { this.start.placeholder = placeholders[0]; }
    if (required) { this.start.required = true; }
    if (pattern) { this.start.pattern = pattern; }
    this.start.addEventListener('input', this.inputHandler, true);

    // end control
    if (captions[1]) {
      var lbl = wrapper.appendChild(document.createElement("div"));
      lbl.classList.add("mpControl-label");
      lbl.innerText = captions[1];
    }
    var wrapperEnd = wrapper.appendChild(document.createElement("div"));
    wrapperEnd.classList.add("mpControl-wrapper");
    // input end control
    this.end = wrapperEnd.appendChild(document.createElement("input"));
    this.end.type = "date";
    this.end.id = selector + "end";
    this.end.name = selector + "end";
    if (placeholders[1]) { this.end.placeholder = placeholders[1]; }
    if (required) { this.end.required = true; }
    if (pattern) { this.end.pattern = pattern; }
    this.end.addEventListener('input', this.inputHandler, true);
    
    if (values.length == 2) {
      this.start.value = values[0];
      this.end.value = values[1];
    }
  }
}
mpDateRange.prototype.oninput = function (event) {
  event.stopImmediatePropagation();
  if (!this.start.value || !this.end.value) {
    return;
  }
  if (this.start.value > this.end.value) {
    return;
  }
  this.fireEvent("input", this.start.value + ","+ this.end.value);
};
