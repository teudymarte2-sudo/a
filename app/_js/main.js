var $c  = document.createElement.bind(document);

function googlePlus() {
  var url = window.location.protocol + '//' + window.location.host;
  window.open('https://plus.google.com/share?url='+url, 'share_gl', 'width=500, height=300, toolbar=no, status=no, menubar=no');
}



(function (doc, win) {
  "use strict";

  function triggerComponents() {
    win.components = win.components || {};
    var
      i = 0,
      components = doc.getElementsByTagName('body')[0].dataset.components;

    if (components !== undefined) {
      components = components.split(' ');
      i = components.length;

      while (i--) {
        if (components[i] !== '' && win.components[components[i]] !== undefined) {
          win.components[components[i]](doc, win);
        }
      }
    }
  }

  triggerComponents();


var gl = document.querySelectorAll('button.google');
    for (var i = 0; i < gl.length; i++) {
        gl[i].addEventListener('click', function(e) {
            e.preventDefault();
            googlePlus();
        }, false);
    }


  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status == 200)
    {
      var response = JSON.parse(xhr.response);
      if (response.country && response.country.iso_code) {
        var country = response.country.iso_code;
      }
    }
  };
  xhr.open("get", 'https://fftf-geocoder.herokuapp.com', true);
  xhr.send();

  if (window.location.href.indexOf('optout') !== -1)
    document.getElementById('opt-in').checked = false;



  var onDomContentLoaded =function() {
    var fb = document.querySelectorAll('a.share');
    for (var i = 0; i < fb.length; i++)
      fb[i].addEventListener('click', function(e) {
        e.preventDefault();
        FreeProgress.share();
      }, false);

    var tw = document.querySelectorAll('a.tweet');
    for (var i = 0; i < tw.length; i++)
      tw[i].addEventListener('click', function(e) {
        e.preventDefault();
        FreeProgress.tweet();
      }, false);
  };

  var isReady = document.readyState;

  if (isReady == "complete" || isReady == "loaded" || isReady == "interactive")
    onDomContentLoaded();
  else if (document.addEventListener)
    document.addEventListener('DOMContentLoaded', onDomContentLoaded, false);

  window.hideForm = function() {
    document.querySelector('dl:first-of-type').style.opacity = 0;
    setTimeout(function() {
      document.querySelector('dl:first-of-type').style.display = 'none';
      document.getElementById('confirm-modal').style.display = 'block';
      setTimeout(function() {
        document.getElementById('confirm-modal').style.opacity = 1;
      }, 10);
    }, 400);
  }

})(document, window);
