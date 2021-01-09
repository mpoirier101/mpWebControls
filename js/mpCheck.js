class mpCheck {
  constructor(selector, options) {

    this._element = document.getElementById(selector);
    this._element.classList.add("mpCheck");

    this.options = options;
    var caption = options.caption || this._element.getAttribute("caption") || "";
    var name = options.name || this._element.getAttribute("name") || selector;
    var value = options.value || this._element.getAttribute("value") || "";
    var type = options.type || this._element.getAttribute("type") || "checkbox";

    //if (width) this._element.style.width = width;
    //if (width) this._element.style.maxWidth = width;
    //if (height) this._element.style.height = height;
    //if (height) this._element.style.maxHeight = height;

    // events
    this.inputHandler = this.oninput.bind(this);
    this.on = function (event, func) {
      this._element.addEventListener(event, func);
    };
    this.fireEvent = function (event, obj) {
      this._element.dispatchEvent(new CustomEvent(event, { detail: obj }));
    };

    var wrapper = this._element; //.appendChild(document.createElement("div"));
    //wrapper.classList.add("mpCheck-wrap");
    
    // input ctrl
    this.ctrl = wrapper.appendChild(document.createElement("input"));
    this.ctrl.type = type;
    this.ctrl.id = selector + "input";
    this.ctrl.name = name;
    if (value) {
      this.ctrl.value = value;
    }
    this.ctrl.addEventListener('input', this.inputHandler, true);

    // caption
    if (caption) {
      var lbl = wrapper.appendChild(document.createElement("div"));
      lbl.classList.add("mpCheck-label");
      lbl.innerText = caption;
    }
  }
}
mpCheck.prototype.oninput = function (event) {
  event.stopImmediatePropagation();
  this.fireEvent("changed", event.target.checked);
};

