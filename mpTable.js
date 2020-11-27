class mpTable  {
  constructor(selector, options) {

    const me = this;
    this._element = document.getElementById(selector);
    this._element.classList.add("mpTable");

    this.options = options;
    var width = options.width || me.getAttribute("width") || "100%";
    var height = options.height || me.getAttribute("height") || "";
    var json = options.json || "";
    me._columns = options.columns || [];
    me._data = options.data || [];
    me._sortOrder = options.sortOrder || 1;
    me._sortProp = options.sortProp || "";

    // events
    this.clickHandler = this.onclick.bind(this);
    this.on = function (event, func) {
      this._element.addEventListener(event, func);
    };
    this.fireEvent = function (event, obj) {
      this._element.dispatchEvent(new CustomEvent(event, { detail: obj }));
    };

    if (width) this._element.style.maxWidth = width;
    if (height) this._element.style.maxHeight = height;

    // table
    me.table = this._element.insertAdjacentElement("afterbegin", document.createElement("table"));
    if (width) me.table.style.maxWidth = width;
    if (height) me.table.style.maxHeight = height;

    // table header
    me.thead = me.table.appendChild(document.createElement("thead"));

    // table body
    me.tbody = me.table.appendChild(document.createElement("tbody"));

    if (json) {
      me._data = JSON.parse(json);
    }
    if (me._data) {
      me._printTable();
    }
  }

  fillTable(items, columns) {
    const me = this;
    if (items) {
      if (items instanceof Array) {
        me._data = items;
      } else {
        me._data = JSON.parse(items);
      }
    }
    if (columns) {
      if (columns instanceof Array) {
        me._columns = columns;
      } else {
        me._columns = JSON.parse(columns);
      }
    }
    me._printTable();
  }

  _printTable() {
    const me = this;
    me.thead.innerHTML = "";
    me.tbody.innerHTML = "";
    printHeader(me.thead, me._columns);
    printRows(me.tbody, me._data, me._columns);

    function printHeader(thead, columns) {
      var tr = document.createElement('tr');
      columns.forEach(function (col, i) {
        var th = document.createElement('th');
        th.classList.add("theme");
        th.innerHTML = col.display;
        if (col.sort) th.innerHTML += (col.sort == 1) ? " &#9650;" : " &#9660;";
        th.addEventListener("click", function (e) {
          headClick(col);
        }, false);
        tr.append(th);
      });
      thead.append(tr);
    }

    function printRows(tbody, items, columns) {
      //const me = this;
      items.forEach(function (item) {
        var tr = document.createElement('tr');
        if (item.id) {
          tr.setAttribute('id', item.id);
          tr.addEventListener('click', me.clickHandler, true);
        }
        columns.forEach(function (col, i) {
          var td = document.createElement('td');
          //td.innerText = item[col.data] || "";
          td.innerText = eval("item." + col.data);
          tr.append(td);
        });
        tbody.append(tr);
      });
    }

    function headClick(col) {
      if (col.data != me._sortProp) {
        me._sortProp = col.data;
        me._sortOrder = 1;
      } else {
        me._sortOrder = (me._sortOrder == 1) ? -1 : 1;
      }
      me._data.sort(dynamicSort(col.data));
      me._columns.map((x) => x.sort = "");
      me._columns.find((x) => x.data == col.data).sort = me._sortOrder;
      me._printTable();
    }

    function dynamicSort(property) {
      return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * me._sortOrder;
      }
    }
  }

  selectRow(id) {
    var rows = this.tbody.querySelectorAll('tr');
    rows.forEach(function (row) {
      if (row.id == id) {
        row.classList.add("theme");
        if (row.hidden) row.scrollIntoView(false);
      } else {
        row.classList.remove("theme");
      }
    });
	}
}
mpTable.prototype.onclick = function (event) {
  event.stopImmediatePropagation();
  var id = event.target.parentElement.id;
  this.selectRow(id);
  this.fireEvent("rowClick", id);
};
