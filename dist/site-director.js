// ==UserScript==
// @name        🔥🔥🔥跳转链接直达🔥🔥🔥
// @description 跳转链接直达，去掉确定跳转链接页面，用于谷歌、知乎、CSDN
// @namespace   https://github.com/WindrunnerMax/TKScript
// @version     1.0.2
// @author      Czy
// @include     *://*google.com/*
// @include     *://*zhihu.com/*
// @include     *://*csdn.net/*
// @license     MIT License
// @require     https://cdn.bootcss.com/jquery/2.1.2/jquery.min.js
// @grant       unsafeWindow
// @grant       GM_xmlhttpRequest
// ==/UserScript==

(function () {
  'use strict';

  function styleInject(css, ref) {
    if (ref === void 0) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') {
      return;
    }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z = "";
  styleInject(css_248z);

  var website = {
    regexp: /google/,
    init: function init($) {
      $("#res a").attr("target", "_blank");
    }
  };

  var website$1 = {
    regexp: /zhihu/,
    init: function init($) {
      $("a").each(function (i, v) {
        var regexp = /https:\/\/link.zhihu.com\/\?target=(.*)/;

        if (v.href.match(regexp)) {
          v.href = v.href.replace(regexp, function ($0, $1) {
            return decodeURIComponent($1);
          });
        }
      });
    }
  };

  var website$2 = {
    regexp: /csdn/,
    init: function init($) {
      $("#article_content  a:not([name])").each(function (i, v) {
        var a = document.createElement("a");
        a.innerHTML = "<span onclick=\"window.open('".concat(v.href, "')\">").concat(v.innerText, "</>");
        v.replaceWith(a);
      });
    }
  };

  var modules = [website, website$1, website$2];

  (function () {
    var $ = window.$;

    var mather = function mather(regex, site) {
      if (regex.test(window.location.href)) {
        for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
          args[_key - 2] = arguments[_key];
        }

        site.init.apply(site, args);
      }
    };

    modules.forEach(function (v) {
      return mather(v.regexp, v, $);
    });
  })();

}());
