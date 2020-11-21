class mpSelect {
  constructor(selector, options) {

    this._element = document.getElementById(selector);
    this._element.classList.add("mpControl");

    this.options = options;
    var name = options.name || this._element.getAttribute("name") || selector;
    var caption = options.caption || this._element.getAttribute("caption") || "";
    var placeholder = options.placeholder || this._element.getAttribute("placeholder") || "Enter text";
    var value = options.value || this._element.getAttribute("value") || "";
    var required = options.required || this._element.getAttribute("required") || "";
    var list = options.list || (this._element.getAttribute("list") || "").split(',');
    
    // events
    this.clickHandler = this.onclick.bind(this);
    this.on = function (event, func) {
      this._element.addEventListener(event, func);
    };
    this.fireEvent = function (event, obj) {
      this._element.dispatchEvent(new CustomEvent(event, { detail: obj }));
    };

    // hidden input for form
    this.input = this._element.appendChild(document.createElement("input"));
    this.input.type = "hidden";
    this.input.name = name;

    // caption
    if (caption) {
      var lbl = this._element.appendChild(document.createElement("div"));
      lbl.classList.add("mpControl-label");
      lbl.innerText = caption;
    }

    var wrapper = this._element.appendChild(document.createElement("div"));
    wrapper.classList.add("mpControl-wrapper");

    // input ctrl
    this.ctrl = wrapper.appendChild(document.createElement("input"));
    this.ctrl.type = "text";
    this.ctrl.id = selector + "input";
    this.ctrl.name = selector;
    this.ctrl.readOnly = true;
    if (placeholder) {
      this.ctrl.placeholder = placeholder;
    }
    if (required) {
      this.ctrl.required = true;
    }

    // input content
    this.content = wrapper.appendChild(document.createElement("div"));
    this.content.classList.add("mpSelect-content");
    this.content.addEventListener('click', this.clickHandler, true);

    if (list && list.length > 0) {
      var content = this.content;
      var me = this;
      content.innerHTML = "";
      list.forEach(function (item, i) {
        var option = document.createElement("option");
        option.value = item[0];
        option.text = item[1];
        if (value == item[0]) {
          me.input.value = item[0];
          me.ctrl.value = item[1];
          me.ctrl.title = item[1];
        }
        content.append(option);
      });
    }
  }
}
mpSelect.prototype.onclick = function (event) {
  event.stopImmediatePropagation();
  if (event.target.text) {
    this.ctrl.value = event.target.text;
    this.ctrl.title = event.target.text;
    this.input.value = event.target.value;
    this.fireEvent("changed", event.target.value);
  }
}
