/*
 Event.prototype.target, preventDefault, stopPropagation.(no currentTarget)
*/
if(Object.defineProperty&&Object.getOwnPropertyDescriptor&&Object.getOwnPropertyDescriptor(Event.prototype,"target")&&!Object.getOwnPropertyDescriptor(Event.prototype,"target").get){(function(){var target=Object.getOwnPropertyDescriptor(Event.prototype,"srcElement");Object.defineProperty(Event.prototype,"target",{get:function(){return target.get.call(this)}})})();(function(){if(!Event.prototype.preventDefault)Event.prototype.preventDefault=function(){this.returnValue=false};if(!Event.prototype.stopPropagation)Event.prototype.stopPropagation=
function(){this.cancelBubble=true}})()};/*
 Source: Eli Grey @ http://eligrey.com/blog/post/textcontent-in-ie8
*/
if(Object.defineProperty&&Object.getOwnPropertyDescriptor&&Object.getOwnPropertyDescriptor(Element.prototype,"textContent")&&!Object.getOwnPropertyDescriptor(Element.prototype,"textContent").get)(function(){var innerText=Object.getOwnPropertyDescriptor(Element.prototype,"innerText");Object.defineProperty(Element.prototype,"textContent",{get:function(){return innerText.get.call(this)},set:function(s){return innerText.set.call(this,s)}})})();
