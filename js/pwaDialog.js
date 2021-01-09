class pwaDialog {
  constructor(selector, options) {

    this._element = document.getElementById(selector);
    this._element.classList.add("mpDialog");
    this._element.style.display = "none";

    this.options = options;
    var caption = options.caption || this._element.getAttribute("caption") || "Dialog";
    var buttons = options.buttons || [];

    // events
    this.closeHandler = this.onclose.bind(this);
    this.on = function (event, func) {
      this._element.addEventListener(event, func);
    };
    this.fireEvent = function (event, obj) {
      this._element.dispatchEvent(new CustomEvent(event, { detail: obj }));
    };
    
    // dialog content
    var content = document.createElement("content");
    var currentContent = this._element.children;
    if (currentContent) {
      // move currentContent into content
      for (var i = 0; i < currentContent.length; i++) {
        content.appendChild(currentContent[i]);
      }
    }
    this._element.appendChild(content);

    // dialog header
    var header = this._element.insertAdjacentElement("afterbegin", document.createElement("header"));
    header.classList.add("theme");
    if (caption) {
      var title = header.appendChild(document.createElement("h1"));
      title.innerText = caption;
    }
    var closeBtn = header.appendChild(document.createElement("h1"));
    closeBtn.innerText = "X";
    closeBtn.value = "0";
    closeBtn.addEventListener('click', this.closeHandler, true);

    // dialog footer
    if (buttons && buttons.length > 0) {
      var footer = this._element.insertAdjacentElement("beforeend", document.createElement("footer"));
      footer.classList.add("theme");
      buttons.forEach(function (button, i) {
        var btnName = "";
        switch (button) {
          case pwaDialog.Buttons.OK:
            btnName = "OK";
            break;
          case pwaDialog.Buttons.Cancel:
            btnName = "Cancel";
            break;
          default:
            btnName = "Unknown";
            break;
        }
        var btn = document.createElement("button");
        btn.type = "button";
        btn.innerText = btnName;
        btn.value = button;
        footer.append(btn);
      });
      footer.addEventListener('click', this.closeHandler, true);
    }
  }

  open() {
    this._element.style.display = "flex";
    }

  close() {
    this._element.style.display = "none";
  }

  static get Buttons() {
    return {
      OK: "1",
      Cancel: "0"
    }
  }
}
pwaDialog.prototype.onclose = function (event) {
  event.stopImmediatePropagation();
  this._element.style.display = 'none';
  var value = event.target.value + "," + event.target.textContent;
  this.fireEvent("closed", value);
};
