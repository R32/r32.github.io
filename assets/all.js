// Generated by Haxe 4.0.0-rc.3
(function (console, $global) { "use strict";
var HxOverrides = function() { };
HxOverrides.substr = function(s,pos,len) {
	if(len == null) {
		len = s.length;
	} else if(len < 0) {
		if(pos == 0) {
			len = s.length + len;
		} else {
			return "";
		}
	}
	if(pos < 0) {
		pos = s.length + pos;
		if(pos < 0) {
			pos = 0;
		}
	}
	return s.substr(pos,len);
};
var Main = function() { };
Main.main = function() {
	document.querySelector("#header button.menu-btn").onclick = function(e) {
		var node = document.querySelector("#header .menu-list");
		node.className = node.className == "menu-list" ? ["menu-list","active"].join(" ") : "menu-list";
		e.stopPropagation();
	};
	var tar = document.querySelector("#markdown-body");
	var side = document.querySelector("#leftSideBar");
	var nodes;
	if(tar == null) {
		tar = document.querySelector("#mainContent");
		nodes = window.document.querySelectorAll("#mainContent" + ">" + ".section");
	} else {
		nodes = Main.makeHeaders(side);
	}
	Main.scrollSpy(tar,side,nodes);
};
Main.makeHeaders = function(side) {
	var hds = window.document.querySelectorAll("#markdown-body" + ">" + "h1" + "[id]" + "," + "#markdown-body" + ">" + "h2" + "[id]" + "," + "#markdown-body" + ">" + "h3" + "[id]" + "," + "#markdown-body" + ">" + "h4" + "[id]");
	var lvlStack = [];
	var frags = window.document.createDocumentFragment();
	var last = null;
	var _g = 0;
	while(_g < hds.length) {
		var hd = hds[_g++];
		var lvl = Std.parseInt(HxOverrides.substr(hd.nodeName,1,1));
		var li = dt.h("LI",null,[dt.h("A",{ href : "#" + hd.getAttribute("id")},hd.textContent)]);
		while(last != li) {
			var len = lvlStack.length;
			if(len == 0 || last == null) {
				frags.appendChild(li);
				lvlStack.push(lvl);
			} else {
				var lastLvl = lvlStack[len - 1];
				if(lvl == lastLvl) {
					if(last.parentElement == null) {
						frags.appendChild(li);
					} else {
						last.parentElement.appendChild(li);
					}
				} else if(lvl > lastLvl) {
					var ul = dt.h("UL");
					ul.appendChild(li);
					last.appendChild(ul);
					lvlStack.push(lvl);
				} else {
					lvlStack.pop();
					last = last.parentElement;
					if(last != null) {
						last = last.parentElement;
					}
					continue;
				}
			}
			last = li;
		}
	}
	if(lvlStack.length > 0 && side != null) {
		side.appendChild(frags);
	}
	return hds;
};
Main.scrollSpy = function(tar,side,nodes) {
	if(tar == null || side == null || dt.getCss(side,"position") != "fixed") {
		return;
	}
	var diff = tar.offsetTop;
	var prev = 0;
	var _g = 0;
	while(_g < nodes.length) {
		var elem = nodes[_g++];
		var curr = elem.offsetTop - diff;
		var half = curr + prev >> 1;
		half += curr - half >> 1;
		Main.spyObjs.push({ id : elem.id, top : half});
		prev = curr;
	}
	if(Main.spyObjs.length > 0) {
		window.onscroll = Main.onListScroll;
		Main.onListScroll();
	}
};
Main.onListScroll = function() {
	if(Main.tot == 0) {
		Main.tot = setTimeout(Main.__onListScroll, 10);
	}
};
Main.__onListScroll = function() {
	var pos = window.document.documentElement.scrollTop;
	var obj = Main.spyObjs;
	var i = 0;
	var j = obj.length - 1;
	while(i <= j) {
		var mid = i + j >> 1;
		if(pos >= obj[mid].top) {
			if(mid + 1 <= j && pos >= obj[mid + 1].top) {
				i = mid + 1;
			} else {
				i = mid;
				break;
			}
		} else {
			j = mid - 1;
		}
	}
	var sa = "a[href=\"#" + obj[i].id + "\"" + "]";
	if(document.querySelector("#markdown-body") == null) {
		var a = window.document.querySelector("#leftSideBar" + ">" + "a.active");
		if(a != null) {
			a.setAttribute("class","");
		}
		var a1 = window.document.querySelector("#leftSideBar" + ">" + sa);
		if(a1 != null) {
			a1.setAttribute("class","active");
		}
	} else {
		var l = window.document.querySelectorAll("#leftSideBar" + " " + "a.active");
		var _g = 0;
		while(_g < l.length) l[_g++].setAttribute("class","");
		var a2 = window.document.querySelector("#leftSideBar" + " " + sa);
		if(a2 != null) {
			a2.setAttribute("class","active");
			var li = a2.parentElement;
			while(li != null) {
				var ul = li.parentElement;
				if(ul != null && ul.nodeName.toUpperCase() == "UL") {
					li = ul.parentElement;
					li.querySelector("a").setAttribute("class","active");
				} else {
					break;
				}
			}
		}
	}
	Main.tot = 0;
};
var Std = function() { };
Std.parseInt = function(x) {
	var v = parseInt(x, x && x[0]=="0" && (x[1]=="x" || x[1]=="X") ? 16 : 10);
	if(isNaN(v)) {
		return null;
	}
	return v;
};
var dt = function() { };
dt.h = function(name,attr,dyn) {
	var dom = window.document.createElement(name);
	if(attr != null) {
		for(var k in attr) dom.setAttribute(k, attr[k]);
	}
	if(dyn != null) {
		if(typeof(dyn) == "string") {
			dt.setText(dom,dyn);
		} else if(((dyn) instanceof Array) && dyn.__enum__ == null) {
			var i = 0;
			while(i < dyn.length) {
				var v = dyn[i];
				if(typeof(v) == "string") {
					dom.appendChild(window.document.createTextNode(v));
				} else {
					dom.appendChild(v);
				}
				++i;
			}
		}
	}
	return dom;
};
dt.setText = function(dom,text) {
	if(dom.nodeType == 1) {
		switch(dom.tagName) {
		case "INPUT":
			dom.value = text;
			break;
		case "OPTION":
			dom.text = text;
			break;
		case "SELECT":
			var select = dom;
			var _g = 0;
			var _g1 = select.options.length;
			while(_g < _g1) {
				var i = _g++;
				if(select.options[i].text == text) {
					select.selectedIndex = i;
					break;
				}
			}
			break;
		default:
			dom.textContent = text;
		}
	} else if(dom.nodeType != 9) {
		dom.nodeValue = text;
	}
	return text;
};
dt.getCss = function(dom,name) {
	if(dom.currentStyle != null) {
		return dom.currentStyle[name];
	} else {
		return window.getComputedStyle(dom,null).getPropertyValue(name);
	}
};
Main.spyObjs = [];
Main.tot = 0;
Main.main();
})(typeof console != "undefined" ? console : {log:function(){}}, {});
