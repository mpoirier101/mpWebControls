class mpText {
  constructor(selector, options) {

    this._element = document.getElementById(selector);
    this._element.classList.add("mpControl");

    this.options = options;
    var caption = options.caption || this._element.getAttribute("caption") || "";
    var placeholder = options.placeholder || this._element.getAttribute("placeholder") || "Enter text";
    var pattern = options.pattern || this._element.getAttribute("pattern") || "";
    var value = options.value || this._element.getAttribute("value") || "";
    var required = options.required || this._element.getAttribute("required") || "";
    var maxlen = options.maxlength || this._element.getAttribute("maxlength") || "";
    var type = options.type || this._element.getAttribute("type") || "text";

    // events
    this.inputHandler = this.oninput.bind(this);
    this.on = function (event, func) {
      this._element.addEventListener(event, func);
    };
    this.fireEvent = function (event, obj) {
      this._element.dispatchEvent(new CustomEvent(event, { detail: obj }));
    };

    // input ctrl
    this.ctrl = document.createElement("input");
    this.ctrl.type = type;
    this.ctrl.id = selector + "input";
    this.ctrl.name = selector;
    
    if (caption) {
      var lbl = this._element.appendChild(document.createElement("span"));
      //lbl.htmlFor = this.ctrl.id;
      lbl.innerText = caption;
    }
    if (placeholder) {
      this.ctrl.placeholder = placeholder;
    }
    if (required) {
      this.ctrl.required = true;
    }
    if (pattern) {
      this.ctrl.pattern = pattern;
    }
    if (maxlen) {
      this.ctrl.maxlength = maxlen;
    }
    if (value) {
      this.ctrl.value = value;
    }
    this._element.appendChild(this.ctrl);
    this.ctrl.addEventListener('input', this.inputHandler, true);
  }
}
mpText.prototype.oninput = function (event) {
  event.stopImmediatePropagation();
  this.fireEvent("input", this.ctrl.value);
};

