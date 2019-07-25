
import Macros.one;
import js.Browser.document;
import js.html.Node;
import nvd.Dt.make as m;

class Main {
	static function main() {
		// menu toggle
		one("#header button.menu-btn").onclick = function(e: js.html.Event){
			var node = one("#header .menu-list");
			node.className = if (node.className == "menu-list") {
				["menu-list", "active"].join(" ");
			} else {
				"menu-list";
			}
			e.stopPropagation();
		};

		// headers
		makeHeaders();
	}

	static function makeHeaders() {
		if (one("#markdown-body") == null) return;
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
			var lvl = Std.parseInt(hd.nodeName.substr(1, 1));
			var li = m("li", null, [
				m("a", {href: "#" + (cast hd:js.html.DOMElement).getAttribute("id")}, hd.textContent)
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
		if (lvlStack.length > 0) one("#leftSideBar").appendChild(frags);
	}
}
