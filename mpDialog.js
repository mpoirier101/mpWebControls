class mpDialog {
  constructor(selector, options) {

    const me = this;
    this._element = document.getElementById(selector);
    this.options = options;

    var pos1 = 0;
    var pos2 = 0;
    var pos3 = 0;
    var pos4 = 0;
  
    var caption = options.caption || this._element.getAttribute("caption") || "Dialog";
    var width = options.width || this._element.getAttribute("width") || "200px";
    var height = options.height || this._element.getAttribute("height") || "200px";
    var buttons = options.buttons || [];

    // events
    this.closeHandler = this.onclose.bind(this);
    this.on = function (event, func) {
      this._element.addEventListener(event, func);
    };
    this.fireEvent = function (event, obj) {
      this._element.dispatchEvent(new CustomEvent(event, { detail: obj }));
    };
    
    // dialog ctrl
    this._element.classList.add("mpDialog");
    this._element.style.display = "none";
    if (width) { this._element.style.width = width; }
    if (height) { this._element.style.height = height; }

    // dialog header
    var header = this._element.appendChild(document.createElement("header"));
    header.classList.add("theme");
    
    if (caption) {
      var title = header.appendChild(document.createElement("h1"));
      title.innerText = caption;
    }
    var closeBtn = header.appendChild(document.createElement("h1"));
    closeBtn.innerText = "X";
    closeBtn.value = "0";
    closeBtn.style.cursor = "pointer";
    closeBtn.addEventListener('click', this.closeHandler, true);

    header.addEventListener("mousedown", function (e) {
      dragMouseDown(e);
    });

    // dialog content
    var content = this._element.appendChild(document.createElement("content"));

    // dialog footer
    if (buttons && buttons.length > 0) {

      var footer = this._element.appendChild(document.createElement("footer"));
      footer.classList.add("theme");

      buttons.forEach(function (button, i) {
        var btnName = "";
        switch (button) {
          case mpDialog.Buttons.OK:
            btnName = "OK";
            break;
          case mpDialog.Buttons.Cancel:
            btnName = "Cancel";
            break;
          default:
            btnName = "Unknown";
            break;
        }
        var btn = document.createElement("button");
        btn.innerText = btnName;
        btn.value = button;
        footer.append(btn);
      });

      footer.addEventListener('click', this.closeHandler, true);
    }

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;
      // release mouse when drag ends  
      document.onmouseup = closeDragElement;
      // call a function whenever the cursor moves:
      document.onmousemove = elementDrag;
    }
      function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      me._element.style.top = (me._element.offsetTop - pos2) + "px";
      me._element.style.left = (me._element.offsetLeft - pos1) + "px";
    }
      function closeDragElement() {
      // stop moving when mouse button is released:
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }

  open() {
    this._element.style.display = "flex";
    if (!this._element.style.top || !this._element.style.left) {
      // set dialog position to screen center
      var availHeight = document.querySelector("body").clientHeight;
      var availWidth = document.querySelector("body").clientWidth;
      this._element.style.top = ((availHeight - this._element.offsetHeight) / 2) + "px";
      this._element.style.left = ((availWidth - this._element.offsetWidth) / 2) + "px";
    }
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
mpDialog.prototype.onclose = function (event) {
  event.stopImmediatePropagation();
  this._element.style.display = 'none';
  var value = event.target.value + "," + event.target.textContent;
  this.fireEvent("closed", value);
};