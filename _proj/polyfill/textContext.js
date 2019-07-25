/*!
  Source: Eli Grey @ http://eligrey.com/blog/post/textcontent-in-ie8
*/
if (Object.defineProperty
  && Object.getOwnPropertyDescriptor
  && Object.getOwnPropertyDescriptor(Element.prototype, "textContent")
  && !Object.getOwnPropertyDescriptor(Element.prototype, "textContent").get) {
  (function() {
    var innerText = Object.getOwnPropertyDescriptor(Element.prototype, "innerText");
    Object.defineProperty(Element.prototype, "textContent",
     // Passing innerText or innerText.get directly does not work,
     // wrapper function is required.
      {
        get: function() {
          return innerText.get.call(this);
        },
        set: function(s) {
         return innerText.set.call(this, s);
        }
      }
    );
  })()
}

