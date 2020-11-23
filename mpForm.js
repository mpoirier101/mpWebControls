"use strict";
var webForm = function () {

	var _uriForm = "";
	var _uriData = "";
	var _map;
	var _infowindow;
	var _position;
	var _assetData;
	// ---------------------------------------------------
	// DATA
	// ---------------------------------------------------
	function selectByID(id) {
		var url = _uriData + '/Select/0/0/?id=' + id;
		return mp.getData(url);
	}
	function selectByName(name) {
		var url = _uriData + '/0/0/Select/?name=' + encodeURIComponent(name);
		return mp.getData(url);
	}
	function list() {
		var url = _uriData + "/List/0/0/";
		return mp.getData(url);
	}
	function listByType(type) {
		var url = _uriData + '/0/0/List/?type=' + encodeURIComponent(type);
		return mp.getData(url);
	}
	function listByName(name) {
		var url = _uriData + '/0/0/List/?name=' + encodeURIComponent(name);
		return mp.getData(url);
	}
	function listByField(name, value) {
		var url = _uriData + '/0/0/ListByField/?fld=' + encodeURIComponent(name) + '&val=' + encodeURIComponent(value);
		return mp.getData(url);
	}
	function update(data) {
		var url = _uriData + '/Update';
		mp.postData(url, data);
	}
	// ---------------------------------------------------
	// FORM
	// ---------------------------------------------------
	function getForm(formName) {
		var dfd = $.Deferred();
		var uri = _uriForm + formName + ".json"
		$.getJSON(uri)
			.done(function (data) {
				dfd.resolve(data)
			})
			.fail(function (rta, rtb, rtc) {
				dfd.reject(rta, rtb, rtc)
			});
		return dfd.promise();
	}
	function createForm(formData, assetData, map, infowindow) {

		var $form = $("#formarea");

		$form.empty();

		$('#formIcon').removeClass().addClass('fa fa-' + formData.icon);
		$('#formTitle').text(formData.caption);

		if (!assetData || !assetData.id) {
			assetData = {
				"id": "0",
				"extid": "0",
				"levels": "0",
				"type": "",
				"name": "",
				"data": {}
			};
		}

		_assetData = assetData;

		_map = map;
		_infowindow = infowindow;

		$form.append($('<input type="hidden" category="id" id="id"     name="id"     value="' + assetData.id + '"/>'));
		$form.append($('<input type="hidden" category="id" id="extid"  name="extid"  value="' + assetData.extid + '"/>'));
		$form.append($('<input type="hidden" category="id" id="levels" name="levels" value="' + assetData.levels + '"/>'));
		//$form.append($('<input type="hidden" category="id" id="type"   name="type"   value="' + assetData.type + '"/>'));
		//$form.append($('<input type="hidden" category="id" id="name"   name="name"   value="' + assetData.name + '"/>'));

		var pos = assetData.data.gps.split(',');
		_position = pos.length ? new google.maps.LatLng(pos[0], pos[1]) : null;

		createLists($form, formData.lists);
		createElements($form, formData.categories, assetData);

		// handle form submit
		$form.submit(function (e) {
			e.preventDefault();

			// add fixed fields
			var data = {};
			$("#formarea :input[category='id']").serializeArray().map(function (x) { data[x.name] = x.value; });

			// add properties
			data.data = {};
			$("#formarea :input[category!='id']").serializeArray().map(function (x) { data.data[x.name] = x.value; });

			// send form data to Web API
			var json = JSON.stringify(data);
			update(json);
		});
	}
	function createLists(parent, lists) {
		$.each(lists, function (i, list) {
			var ul = $('<ul  id="' + list.name + '" name="' + list.name + '" class="w3-hide" >');
			if (list.items) {
				$.each(list.items, function (o, item) {
					ul.append('<li value="' + item.value + '">' + item.caption + '</li>');
				});
			}
			parent.append(ul);
		});
	}
	function createElements(form, categories, data) {

		$.each(categories, function (i, category) {

			var header = $('<div class="mp-header w3-theme w3-large">' + (category.caption || '') + '</div>');
			form.append(header);
			var cat = $('<div id="' + category.name + '" name="' + category.name + '"></div>');
			form.append(cat);

			$.each(category.items, function (i, obj) {

				var div = {}
				switch (obj.type) {

					case "date":
					case "datetime-local":
						var dataValue = data[obj.name] ? data[obj.name] : data.data ? data.data[obj.name] : "";
						var date = new Date(dataValue);
						if (date == null || isNaN(Date.parse(date))) {
							date = new Date(1001, 0, 1);
						}
						var dateString = mp.dateyyyymmdd(date);

						div = $('<div class="wrap w3-padding-top"><label for="' + obj.name + '">' + (obj.caption || obj.name) + '</label><input type="' + obj.type + '" id="' + obj.name + '" name="' + obj.name + '" class="w3-input" value="' + dateString + '"  /></div>');
						break;

					case "gps":
						var dataValue = data[obj.name] ? data[obj.name] : data.data ? data.data[obj.name] : "";
						div = $('<div class="wrap w3-padding-top"><label for="' + obj.name + '">' + (obj.caption || obj.name) + '</label> <button class="w3-btn w3-padding-small w3-left-align w3-theme" onClick="return webForm.placeMarker();">Move</button><input type="text" id="' + obj.name + '" name="' + obj.name + '" class="w3-input" value="' + dataValue + '"  /></div>');
						break;

					case "color":
					case "email":
					case "file":
					case "image":
					case "month":
					case "number":
					case "password":
					case "range":
					case "search":
					case "tel":
					case "text":
					case "time":
					case "url":
					case "week":
						var dataValue = data[obj.name] ? data[obj.name] : data.data ? data.data[obj.name] : "";
						div = $('<div class="wrap w3-padding-top"><label for="' + obj.name + '">' + (obj.caption || obj.name) + '</label><input type="' + obj.type + '" id="' + obj.name + '" name="' + obj.name + '" class="w3-input" value="' + dataValue + '"  /></div>');
						break;

					case "checkbox":
						var dataValue = data[obj.name] ? data[obj.name] : data.data ? data.data[obj.name] : "";
						div = $('<div class="wrap w3-padding-top"><label for="' + obj.name + '">' + (obj.caption || obj.name) + '</label><input type="checkbox" id="' + obj.name + '" name="' + obj.name + '" value="' + (obj.value || "ok") + '" class="w3-check" style="margin:0 8px 0 8px;" /></div>');
						break;

					case "radio":
						div = $('<div class="wrap w3-padding-top"><label for="' + obj.name + '">' + (obj.caption || obj.name) + '</label></div>');
						if (obj.list) {
							$.each(obj.list, function (o, opt) {
								div.append('<input type="radio" name="' + obj.name + '" value="' + opt.value + '" class="w3-radio" style="margin:0 8px 0 8px;">' + opt.caption + ' ');
							});
						}
						break;

					case "radio2":
						div = $('<div class="wrap w3-padding-top"><label for="' + obj.name + '">' + (obj.caption || obj.name) + '</label><br/></div>');
						if (obj.list) {
							$.each(obj.list, function (o, opt) {
								div.append('<input type="radio" name="' + obj.name + '" value="' + opt.value + '" class="w3-radio" style="margin:0 8px 0 8px;">' + opt.caption + ' ');
							});
						}
						break;

					case "select":
						var dataValue = data[obj.name] ? data[obj.name] : data.data ? data.data[obj.name] : "";

						div = $('<div class="wrap w3-padding-top"><label for="' + obj.name + '">' + (obj.caption || obj.name) + '</label></div>');
						var select = $('<select id="' + obj.name + '" name="' + obj.name + '" class="w3-select"/>');
						if (obj.list) {
							$.each(obj.list, function (o, opt) {
								var selected = dataValue == opt.value ? "selected" : "";
								select.append('<option value="' + opt.value + '" sublist="' + opt.sublist + '" ' + selected + '>' + opt.caption + '</option>');
							});
						}
						div.append(select);
						break;

					case "menuitem":
						div = $('<div id="' + obj.name + '" name="' + obj.name + '" class="w3-text-theme w3-large"><a id="' + obj.name + '" name="' + obj.name + '" href="' + obj.link + '">' + obj.caption + '</a></div>');
						break;

					case "hidden":
						div = $('<input id="' + obj.name + '" name="' + obj.name + '" type="hidden" value="' + obj.value + '"/>');
						break;

					case "link":
						div = $('<a id="' + obj.name + '" name="' + obj.name + '" href="' + obj.link + '">' + obj.caption + '</a>');
						break;

					case "button":
					case "cancel":
					case "reset":
					case "submit":
						div = $('<input id="' + obj.name + '" name="' + obj.name + '" type="' + obj.type + '" class="w3-btn w3-left-align w3-theme" value="' + (obj.caption || obj.name) + '"/>');
						break;

					default:
						div = $('<label>Unknown type: ' + obj.type + ' - ' + (obj.caption || obj.name) + '</label>');
				}

				if (obj.hint) {
					$("input", div).attr("placeholder", obj.hint);
				}

				if (obj.tooltip) {
					div.attr("title", obj.tooltip);
				}

				if (obj.info) {

					var target = obj.name + 'info';

					var divInfo = $('<div id="' + target + '" name="' + target + '" class="w3-panel w3-topbar w3-bottombar w3-theme-l4 w3-border-theme" >' + obj.info + '</div>');
					$(divInfo).css("display", "none");

					var divIcone = $('<i class="w3-xlarge fa fa-question-circle-o" style="margin:0 8x 0 8px;"></i>');
					divIcone.click({ target: target }, showIt);

					div.append(divIcone);
					div.append(divInfo);
				}

				if (obj.maxLength) {
					$("input", div).attr("maxLength", obj.maxLength);
				}

				if (obj.pattern) {
					$("input", div).attr("pattern", obj.pattern);
				}

				if (obj.min) {
					$("input", div).attr("min", obj.min);
				}
				if (obj.max) {
					$("input", div).attr("max", obj.max);
				}

				if (obj.low) {
					$("input", div).attr("low", obj.low);
				}
				if (obj.high) {
					$("input", div).attr("high", obj.high);
				}

				if (obj.click) {
					var f = obj.click;
					if (f) {
						//div.on("click", f);
						div.attr("onclick", obj.click + "()");
					}
				}

				if (obj.show) {
					var hash = obj.show.split(".");
					var source = hash[0];
					var value = hash[1];
					var target = obj.name;
					var $sourcediv = $('[name="' + source + '"]');
					if (value) {
						$sourcediv.change({ target: target, value: value }, showIt);
					}
					else {
						$sourcediv.click({ target: target }, showIt);
					}

					$(div).css("display", "none");
				}

				if (obj.source) {
					var $source = $('[name="' + obj.source + '"]');
					$source.change({ target: obj.name, source: obj.source }, updateList);
				}

				if (obj.required) {
					$("input", div).attr("required", "1");
					$("input", div).attr("validate", "1");
					div.prepend('<i class="w3-xlarge fa fa-pencil-square-o empty" style="padding-right:8px;"></i>');
				}

				$("input", div).attr("category", category.name);

				cat.append(div);
			})
		});
	}
	function clearForm() {
		window.location.reload(true);
		return true;
	}
	function cancelForm() {
		window.location = window.location.origin;
	}
	function validateForm() {
		var result = true;
		var empty = "w3-xlarge fa fa-pencil-square-o empty";
		var warning = "w3-xlarge fa fa-exclamation-triangle warning";
		var success = "w3-xlarge fa fa-check-square-o success";
		var error = "w3-xlarge fa fa-times-circle-o error";

		// get all input controls
		$(":input[validate]").each(function () {
			// find wrapper
			var p = $(this).parent(".wrap");
			if (p) {
				// find related icon <i> tag
				var c = $(p).find("i");
				if (c[0]) {
					$(c).removeClass();
					// change icon, color and text
					if (this.validity.valid) {
						var v = $(this).val();
						var l = $(this).attr("low");
						var h = $(this).attr("high");

						if ((this.type == "radio") && (this.checked) && (v == "false")) {
							$(c).addClass(warning);
						}
						else if ((l && v < l) || (h && v > h)) {
							$(c).addClass(warning);
						}
						else {
							$(c).addClass($(this).val() == "" ? empty : success);
						}
					}
					else {
						$(c).addClass(this.validity.valueMissing ? empty : error);
						result = false;
					}
				}
			}
		})
		return result;
	}
	function setTag() {
		var t = document.getElementById("Tank_Tag");
		if (t) {
			if (t.value == "") {
				var tag = $("#key").val();
				t.value = tag;
			}
		}
	}
	function nextField(event) {

		if (event.keyCode != 13) {
			return true;
		}
		else {
			event.preventDefault();

			var ctrl = event.target.name;
			var $inputs = $(":input");

			for (var i = 0; i < $inputs.length; i++) {

				var $f = $inputs[i];

				if ($f.name == ctrl) {
					var nextInput = $inputs[i + 1];
					if (nextInput) {
						nextInput.focus();
					}
					break;
				}
			}
		}
	}
	function showReports() {
		window.location = "webdata.aspx?form=reports";
	}
	function showImage(img) {
		var $newdiv1 = $("<img id='img1' title='" + img + "' src='images/" + img + "' />");
		$($newdiv1).dialog();
	}
	function scanBarcode(target) {
		$('#' + target).val(Android.scanBarcode());
	}
	function showIt(event) {

		var target = $('#' + event.data.target);
		var parent = target.parent('div')
		var source = this;

		if (this.type == "checkbox") {
			if (this.checked) {
				parent.show();
			} else {
				parent.hide();
			}
			return true;
		}

		if (event.data.value) {
			if (event.currentTarget.value == event.data.value) {
				parent.show();
			} else {
				parent.hide();
				if ($(target).attr('type') == "text") {
					$(target).val("");
				}
			}
		}
		else {
			if (event.type == "click") {
				target.toggle();
			}
			else {
				if (this.checked) {
					target.show();
				} else {
					target.hide();
				}
			}
		}
		return true;
	}
	function updateList(event) {
		var srcList = document.getElementById(event.data.source);
		var tarList = document.getElementById(event.data.target);
		var selSrc = srcList.options[srcList.selectedIndex].attributes['sublist'].value;

		while (tarList.options.length) {
			tarList.remove(0);
		}

		var list = document.getElementById(selSrc);
		if (list) {
			var itms = list.getElementsByTagName("li");
			if (itms) {
				for (var i = 0; i < itms.length; i++) {
					var itm = new Option(itms[i].innerText, i);
					tarList.options.add(itm);
				}
			}
		}
	}
	// ---------------------------------------------------
	// MAP
	// ---------------------------------------------------
	function initMap(map) {

		if (map === undefined) {
			_map = new google.maps.Map(document.getElementById('minimap'), {
				zoom: 15,
				mapTypeId: 'terrain'
			});
			getLocation();
			_map.setCenter(_position);
		}
		else {
			_map = map;
		}
	}
	function placeMarker() {
		var info = _infowindow.getContent();
		_infowindow.setContent("Drag me!");
		_assetData.marker.setDraggable(true);
		_assetData.marker.setTitle("Drag me!");
		_assetData.marker.addListener('dragend', function (e) {
			_infowindow.setContent(info);
			_assetData.marker.setDraggable(false);
			_assetData.marker.setTitle(_assetData.name);
			_assetData.marker.setPosition(e.latLng);
			setNewLocation(e.latLng, _map);
		});
		return false;
	}
	function setNewLocation(pos, _map) {
		_position = pos.lat() + "," + pos.lng();
		var x = document.getElementById("gps");
		if (x) {
			x.value = _position;
		}
	}
	function getPostalCode(pos, _map) {
		var uri = "https://maps.googleapis.com/maps/api/geocode/json";

		var data = {
			latlng: pos,
			//result_type: "postal_code|colloquial_area",
			key: "AIzaSyCMM9iAmmMBt5vXpQHfy4qfu7kP7j3_UDo"
		};

		$.getJSON(uri, data, function (result) {
			var pc = "";

			var rr = result.status != "ZERO_RESULTS";

			if (rr) {
				pc = result.results[0];

				var x = document.getElementById("GEO");
				if (x) {
					x.value = x.value + ', ' + pc.formatted_address;
				}
			}
		});
	}
	function getLocation() {
		var options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0
		};
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(setLocation, setDefaultLocation, options);
		}
	}
	function setLocation(pos) {
		_position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
		_map.setCenter(_position);
	}
	function setDefaultLocation() {
		_position = new google.maps.LatLng(0, 0);
		//_map.setCenter(_position);
	}
	function showError(error) {
		var x = document.getElementById("gps");
		if (x) {
			if (error) {
				switch (error.code) {
					case error.PERMISSION_DENIED:
						x.value = "User denied access to Geolocation."
						break;
					case error.POSITION_UNAVAILABLE:
						x.value = "Location information unavailable."
						break;
					case error.TIMEOUT:
						x.value = "The _position request timed out."
						break;
					case error.UNKNOWN_ERROR:
						x.value = "An unknown error occurred."
						break;
				}
			}
			else {
				x.value = "Geolocation not supported.";
			}
		}
	}
	function showMapDialog() {

		$('#mapDialog').dialog('open');

		placeMarker(_position, _map);
		_map.setCenter(_position);
	}

	return {
		set uriForm(value) { _uriForm = value; },
		set uriData(value) { _uriData = value; },

		selectByID: selectByID,
		selectByName: selectByName,
		list: list,
		listByType: listByType,
		listByName: listByName,
		listByField: listByField,
		update: update,
		getForm: getForm,
		createForm: createForm,
		placeMarker: placeMarker,
		showMapDialog: showMapDialog,
	};
}();