class mpSelectMany {
  constructor(selector, options) {

    this._element = document.getElementById(selector);
    this._element.classList.add("mpSelect");

    this.options = options;
    var caption = options.caption || this._element.getAttribute("caption") || "";
    var placeholder = options.placeholder || this._element.getAttribute("placeholder") || "Enter text";
    var value = options.value || this._element.getAttribute("value") || "";
    var required = options.required || this._element.getAttribute("required") || "";
    var list = options.list || (this._element.getAttribute("list") || "").split(',');
    var descriptions = [];

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

    this.content = document.createElement("div");
    this.content.classList.add("mpSelect-content");

    if (list && list.length > 0) {
      var content = this.content;
      var ctrl = this.ctrl;
      content.innerHTML = "";
      list.forEach(function (item, i) {
        var checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = ctrl.id + item[0];
        checkbox.name = selector;
        checkbox.value = item[0];

        if (value && value.indexOf(item[0]) > -1) {
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
    }

    var desc = descriptions.join(", ");
    this.ctrl.value = desc;
    this.ctrl.title = desc;
    this._element.appendChild(this.content);
    
    this.content.addEventListener('click', this.clickHandler, true);
  }
}
mpSelectMany.prototype.onclick = function (event) {
  event.stopImmediatePropagation();
  if (event.target.tagName == "INPUT") {
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
    this.fireEvent("changed", val);
  }
};
