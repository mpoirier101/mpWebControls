class mpRadio {
  constructor(selector, options) {

    this._element = document.getElementById(selector);
    this.selector = selector;
    //this._element.classList.add("mpControl");

    this.options = options;
    var caption = options.caption || this._element.getAttribute("caption") || "";
    this.name = options.name || this._element.getAttribute("name") || selector;
    this.value = options.value || this._element.getAttribute("value") || "";
    this.required = options.required || this._element.getAttribute("required") || "";
    var list = options.list || this._element.getAttribute("list");
    var width = options.width || this._element.getAttribute("width") || "";
    var height = options.height || this._element.getAttribute("height") || "";
    
    if (width) this._element.style.width = width;
    //if (width) this._element.style.maxWidth = width;
    if (height) this._element.style.height = height;
    //if (height) this._element.style.maxHeight = height;

    // events
    this.clickHandler = this.onclick.bind(this);
    this.on = function (event, func) {
      this._element.addEventListener(event, func);
    };
    this.fireEvent = function (event, obj) {
      this._element.dispatchEvent(new CustomEvent(event, { detail: obj }));
    };

   // caption
    if (caption) {
      var lbl = this._element.appendChild(document.createElement("div"));
      lbl.classList.add("mpRadio-label");
      lbl.innerText = caption;
    }

    // input content
    this.content = this._element.appendChild(document.createElement("div"));
    this.content.classList.add("mpRadio-content");
    this.content.addEventListener('click', this.clickHandler, true);
    this.content.innerHTML = "";

    this.setList(list);
  }

  setList(values) {
    var me = this;
    var content = this.content;

    if (!values) {
      content.innerHTML = "Select Date on Calendar...";
      return;
    }
    if (typeof (values) == "string") {
      values = values.split(",");
    }
    if (values && values.length > 0 && values[0] != "") {
      content.innerHTML = "";

      values.forEach(function (item, i) {
        var radio = document.createElement("input");
        radio.type = "radio";
        radio.id = me.selector + "input" + item[0];
        radio.name = me.name;
        radio.value = item[0];
        if (me.value == item[0]) {
          radio.checked = true;
        }
        if (me.required) {
          radio.required = true;
        }
        var lbl = document.createElement("label");
        lbl.classList.add("mpRadio-label");
        lbl.htmlFor = radio.id;
        lbl.innerText = item[1];
        var div = document.createElement("div");
        div.append(radio);
        div.append(lbl);
        content.append(div);
      });
    }
  }
}
mpRadio.prototype.onclick = function (event) {
  event.stopImmediatePropagation();
  if (event.target.value) {
    this.fireEvent("changed", event.target.value);
  }
}
