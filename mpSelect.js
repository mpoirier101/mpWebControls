class mpSelect {
  constructor(selector, options) {

    this._element = document.getElementById(selector);
    this._element.classList.add("mpSelect");

    this.options = options;
    var caption = options.caption || this._element.getAttribute("caption") || "";
    var placeholder = options.placeholder || this._element.getAttribute("placeholder") || "Enter text";
    var value = options.value || this._element.getAttribute("value") || "";
    var required = options.required || this._element.getAttribute("required") || "";
    var list = options.list || (this._element.getAttribute("list") || "").split(',');
    var description = "";
    
    // events
    this.clickHandler = this.onclick.bind(this);
    this.on = function (event, func) {
      this._element.addEventListener(event, func);
    };
    this.fireEvent = function (event, obj) {
      this._element.dispatchEvent(new CustomEvent(event, { detail: obj }));
    };

    // input ctrl
    this.ctrl = document.createElement("input");
    this.ctrl.type = "text";
    this.ctrl.id = selector + "input";
    this.ctrl.name = selector;
    this.ctrl.readOnly = true;

    if (caption) {
      var lbl = this._element.appendChild(document.createElement("label"));
      lbl.htmlFor = this.ctrl.id;
      lbl.innerText = caption;
      this.ctrl.placeholder = placeholder;
    }
    if (placeholder) {
      this.ctrl.placeholder = placeholder;
    }
    if (required) {
      this.ctrl.required = true;
    }
    this._element.appendChild(this.ctrl);

    // input content
    this.content = document.createElement("div");
    this.content.classList.add("mpSelect-content");

    if (list && list.length > 0) {
      var content = this.content;
      var ctrl = this.ctrl;
      content.innerHTML = "";
      list.forEach(function (item, i) {
        var option = document.createElement("option");
        option.value = item[0];
        option.text = item[1];
        if (value == item[0]) {
          description = item[1];
        }
        content.append(option);
      });

      this.ctrl.value = description;
      this.ctrl.title = description;
    }
    this._element.appendChild(this.content);
    
    this.content.addEventListener('click', this.clickHandler, true);
  }
}
mpSelect.prototype.onclick = function (event) {
  event.stopImmediatePropagation();
  if (event.target.text) {
    this.ctrl.value = event.target.text;
    this.ctrl.title = event.target.text;
    this.fireEvent("changed", event.target.value);
  }
};
