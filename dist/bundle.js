var app = (() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, {get: all[name], enumerable: true});
  };

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    draw: () => draw,
    keyPressed: () => keyPressed,
    keyReleased: () => keyReleased,
    setup: () => setup
  });
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  function setup() {
    createCanvas(Math.max(document.documentElement.clientWidth, window.innerWidth || 0), Math.max(document.documentElement.clientHeight, window.innerHeight || 0));
  }
  function draw() {
    background(20);
    textAlign(CENTER, CENTER);
    textSize(height / 10);
    fill(200);
    text("Hello World!", width / 2, height / 2);
  }
  function keyPressed() {
  }
  function keyReleased() {
  }
  return src_exports;
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL2luZGV4LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyIvLy8gQHRzLWNoZWNrXHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9ub2RlX21vZHVsZXMvQHR5cGVzL3A1L2dsb2JhbC5kLnRzXCIgLz5cclxuXHJcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjb250ZXh0bWVudVwiLCAoZXZlbnQpID0+IGV2ZW50LnByZXZlbnREZWZhdWx0KCkpXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0dXAoKSB7XHJcbiAgY3JlYXRlQ2FudmFzKFxyXG4gICAgTWF0aC5tYXgoZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLCB3aW5kb3cuaW5uZXJXaWR0aCB8fCAwKSxcclxuICAgIE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsIHdpbmRvdy5pbm5lckhlaWdodCB8fCAwKVxyXG4gIClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRyYXcoKSB7XHJcbiAgYmFja2dyb3VuZCgyMClcclxuICB0ZXh0QWxpZ24oQ0VOVEVSLCBDRU5URVIpXHJcbiAgdGV4dFNpemUoaGVpZ2h0IC8gMTApXHJcbiAgZmlsbCgyMDApXHJcbiAgdGV4dChcIkhlbGxvIFdvcmxkIVwiLCB3aWR0aCAvIDIsIGhlaWdodCAvIDIpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBrZXlQcmVzc2VkKCkge31cclxuZXhwb3J0IGZ1bmN0aW9uIGtleVJlbGVhc2VkKCkge31cclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdBLFdBQVMsaUJBQWlCLGVBQWUsQ0FBQyxVQUFVLE1BQU07QUFFbkQ7QUFDTCxpQkFDRSxLQUFLLElBQUksU0FBUyxnQkFBZ0IsYUFBYSxPQUFPLGNBQWMsSUFDcEUsS0FBSyxJQUFJLFNBQVMsZ0JBQWdCLGNBQWMsT0FBTyxlQUFlO0FBQUE7QUFJbkU7QUFDTCxlQUFXO0FBQ1gsY0FBVSxRQUFRO0FBQ2xCLGFBQVMsU0FBUztBQUNsQixTQUFLO0FBQ0wsU0FBSyxnQkFBZ0IsUUFBUSxHQUFHLFNBQVM7QUFBQTtBQUdwQztBQUFBO0FBQ0E7QUFBQTsiLAogICJuYW1lcyI6IFtdCn0K
