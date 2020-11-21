class mpSelectMany {
  constructor(selector, options) {

    this._element = document.getElementById(selector);
    this._element.classList.add("mpControl");

    this.options = options;
    var name = options.name || this._element.getAttribute("name") || selector;
    var caption = options.caption || this._element.getAttribute("caption") || "";
    var placeholder = options.placeholder || this._element.getAttribute("placeholder") || "Enter text";
    var values = options.values || this._element.getAttribute("values") || "";
    var required = options.required || this._element.getAttribute("required") || "";
    var list = options.list || (this._element.getAttribute("list") || "").split(',');

    // events
    this.inputHandler = this.oninput.bind(this);
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
    this.input.value = values;

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
    this.content.addEventListener('input', this.inputHandler, true);

    if (list && list.length > 0) {
      var content = this.content;
      var ctrl = this.ctrl;
      var descriptions = [];
      content.innerHTML = "";
      list.forEach(function (item, i) {
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = ctrl.id + item[0];
        checkbox.name = selector;
        checkbox.value = item[0];
        if (values && values.indexOf(item[0]) > -1) {
          checkbox.checked = true;
          descriptions.push(item[1]);
        }
        var label = document.createElement("label");
        label.htmlFor = ctrl.id + item[0];
        label.innerText = item[1];
        var div = document.createElement("div");
        div.append(checkbox);
        div.append(label);
        content.append(div);
      });

      var desc = descriptions.join(", ");
      this.ctrl.value = desc;
      this.ctrl.title = desc;
    }
  }
}
mpSelectMany.prototype.oninput = function (event) {
  event.stopImmediatePropagation();
  var descriptions = [];
  var values = [];
  var selected = this.content.querySelectorAll("input:checked");
  selected.forEach((checkbox) => {
    descriptions.push(checkbox.nextElementSibling.textContent);
    values.push(checkbox.value);
  });
  var desc = descriptions.join(", ");
  var val = values.join(",");
  this.ctrl.value = desc;
  this.ctrl.title = desc;
  this.input.value = val;
  this.fireEvent("changed", val);
};
