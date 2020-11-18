//  include('alert.js') ;
// alert('Hello Val!!! in Gulp - This is alert JS');



// ===================================
//функция которая добавляет класс webp в html, для браузеров, которые поддерживают этот формат
// JS - ФУНКЦИЯ ОПРЕДЕЛЕНИЯ ПОДДЕРЖКИ WEBP

function testWebP(callback) {

  var webP = new Image();
  webP.onload = webP.onerror = function () {
    callback(webP.height == 2);
  };
  webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

  if (support == true) {
    document.querySelector('h2').classList.add('webp');
  } else {
    document.querySelector('h2').classList.add('no-webp');
  }
});

// =====================================
// для стилей шрифтов
function cb() {
  cb()
}
