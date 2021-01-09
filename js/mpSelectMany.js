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
		var list = options.list || (this._element.getAttribute("list") || "").split(",");
    var width = options.width || this._element.getAttribute("width") || "";
    var height = options.height || this._element.getAttribute("height") || "";

    if (width) this._element.style.width = width;
    if (width) this._element.style.maxWidth = width;
    //if (height) this._element.style.height = height;
    if (height) this._element.style.maxHeight = height;

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

		// caption
		if (caption) {
			var lbl = this._element.appendChild(document.createElement("div"));
			lbl.classList.add("mpControl-label");
			lbl.innerText = caption;
		}

		var wrapper = this._element.appendChild(document.createElement("div"));
		wrapper.classList.add("mpControl-wrap");

		// input ctrl
		this.ctrl = wrapper.appendChild(document.createElement("input"));
		this.ctrl.type = "text";
		this.ctrl.id = selector + "input";
    this.ctrl.setAttribute("autocomplete", "off");
    this.ctrl.onkeypress = function (event) {
      event.target.value = "";
      return false;
    }
    if (placeholder) {
			this.ctrl.placeholder = placeholder;
		}
		if (required) {
			this.ctrl.required = true;
		}

		// input content
		this.content = wrapper.appendChild(document.createElement("div"));
		this.content.classList.add("mpSelect-content");
		this.content.addEventListener("input", this.inputHandler, true);

		if (list && list.length > 0) {
			var content = this.content;
			var ctrl = this.ctrl;
			var descriptions = [];
			var data = [];
			content.innerHTML = "";
			list.forEach(function (item, i) {
				var checkbox = document.createElement("input");
				checkbox.type = "checkbox";
				checkbox.id = ctrl.id + item[0];
				checkbox.name = name;
				checkbox.value = item[0];
				if (values && values.indexOf(item[0]) > -1) {
					checkbox.checked = true;
					data.push(item[0]);
					descriptions.push(item[1]);
				}
				var label = document.createElement("label");
        label.classList.add("mpControl-label");
				label.htmlFor = ctrl.id + item[0];
				label.innerText = item[1];
				var div = document.createElement("div");
				div.append(checkbox);
				div.append(label);
				content.append(div);
			});

			var desc = descriptions.join(", ");
			var val = data.join(",");
			this.input.value = val;
			this.ctrl.value = desc;
			this.ctrl.title = desc;
		}
	}
}
mpSelectMany.prototype.oninput = function (event) {
  event.stopImmediatePropagation();
  var descriptions = [];
  var data = [];
  var selected = this.content.querySelectorAll("input:checked");
  selected.forEach((checkbox) => {
    descriptions.push(checkbox.nextElementSibling.textContent);
    data.push(checkbox.value);
  });
  var desc = descriptions.join(", ");
  var val = data.join(",");
  this.input.value = val;
  this.ctrl.value = desc;
  this.ctrl.title = desc;
  this.fireEvent("changed", val);
};
