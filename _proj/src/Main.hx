
import Macros.one;
import js.Browser.document;
import js.html.Node;
import js.html.DOMElement;
import nvd.Dt.make as m;

@:nullSafety
class Main {
	static function main() {
		// #header menu toggle
		one("#header button.menu-btn").onclick = function(e: js.html.Event){
			var node = one("#header .menu-list");
			node.className = if (node.className == "menu-list") {
				["menu-list", "active"].join(" ");
			} else {
				"menu-list";
			}
			e.stopPropagation();
		};

		// #leftSideBar
		var tar = one("#markdown-body");
		var side = one("#leftSideBar");
		var nodes = if (tar == null) { // for list.html
			tar = one("#mainContent");
			document.querySelectorAll("#mainContent" + ">" + ".section");
		} else {
			makeHeaders(side);         // for post.html
		}
		scrollSpy(tar, side, nodes);

		// more...
	}

	static function makeHeaders(side) {
		var hds = document.querySelectorAll( // :scope > h1[id], ...
			"#markdown-body" + ">" + "h1" + "[id]" + "," +
			"#markdown-body" + ">" + "h2" + "[id]" + "," +
			"#markdown-body" + ">" + "h3" + "[id]" + "," +
			"#markdown-body" + ">" + "h4" + "[id]"
		);
		var lvlStack = []; //
		var frags = document.createDocumentFragment();
		var last:Null<Node> = null;
		for (hd in hds) {
			var hd = (cast hd: js.html.DOMElement);
			var lvl:Int = @:nullSafety(Off) Std.parseInt(hd.nodeName.substr(1, 1));
			var li = m("li", null, [
				m("a", {href: "#" + hd.getAttribute("id")}, hd.textContent)
			]);
			while (last != li) {
				var len = lvlStack.length;
				if (len == 0 || last == null) {
					frags.appendChild(li);
					lvlStack.push( lvl );
				} else {
					var lastLvl = lvlStack[len - 1];
					if (lvl == lastLvl) {
						if (last.parentElement == null)
							frags.appendChild(li);
						else
							last.parentElement.appendChild(li);
					} else if (lvl > lastLvl) { // h3 > h2
						var ul = m("ul");
						ul.appendChild(li);
						last.appendChild(ul);
						lvlStack.push(lvl);
					} else { // h3 < h4
						lvlStack.pop();
						last = last.parentElement;     // UL
						if (last != null)
							last = last.parentElement; // LI
						continue;
					}
				}
				last = li;
			}
		}
		// append
		if (lvlStack.length > 0 && side != null) side.appendChild(frags);
		return hds;
	}

	static var spyObjs: Array<{top:Int, id:String}> = [];

	// scrollSpy for list.html
	static function scrollSpy(tar: DOMElement, side: DOMElement, nodes: js.html.NodeList) {
		if (tar == null || side == null || nvd.Dt.getCss(side, "position") != "fixed") return;
		var diff = tar.offsetTop;
		var prev = 0;
		for (elem in nodes) {
			var elem = (cast elem : DOMElement);
			var curr = elem.offsetTop - diff;  // 100%
			var half = curr + prev >> 1;       // 50%
			half += curr - half >> 1;          // 75%
			spyObjs.push( {id: elem.id, top: half } );
			prev = curr;
		}
		if (spyObjs.length > 0) {
			js.Browser.window.onscroll = onListScroll;
			onListScroll();
		}
	}

	static var tot = 0;
	static function onListScroll() {
		if (tot == 0) tot = js.Syntax.code("setTimeout({0}, 10)", __onListScroll); // throttle
	}
	static function __onListScroll() {
		var pos = document.documentElement.scrollTop;
		var obj = spyObjs;
		var i = 0;
		var j = obj.length - 1;
		// binary search
		while (i <= j) {
			var mid = (i + j) >> 1;
			if (pos >= obj[mid].top) {
				if (mid + 1 <= j && pos >= obj[mid + 1].top) {
					i = mid + 1;
				} else {
					i = mid; // result
					break;
				}
			} else {
				j = mid - 1;
			}
		}
		var sa = 'a[href="#' + obj[i].id + '"' +"]";
		if (one("#markdown-body") == null) { // for list.html
			var a = document.querySelector("#leftSideBar" + ">" + "a.active");
			if (a != null)
				a.setAttribute("class", ""); // need classList?
			var a = document.querySelector("#leftSideBar" + ">" + sa);
			if (a != null)
				a.setAttribute("class", "active");
		} else {
			var l = document.querySelectorAll("#leftSideBar" + " " +"a.active");
			for (a in l)
				(cast a : DOMElement).setAttribute("class", "");
			var a = document.querySelector("#leftSideBar" + " " + sa);
			if (a != null) {
				a.setAttribute("class", "active");
				var li = a.parentElement;
				while(li != null) {
					var ul = li.parentElement;
					if (ul != null && ul.nodeName.toUpperCase() == "UL") {
						li = ul.parentElement;
						li.querySelector("a").setAttribute("class", "active");
					} else {
						break;
					}
				}
			}
		}
		tot = 0;
	}
}
