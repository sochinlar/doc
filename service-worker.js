/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "f603914a8a5c6212de689a8df6cc96d4"
  },
  {
    "url": "assets/css/0.styles.cc2a2ebf.css",
    "revision": "6d079eb24adec22d599ddb69f525f6dd"
  },
  {
    "url": "assets/img/search.83621669.svg",
    "revision": "83621669651b9a3d4bf64d1a670ad856"
  },
  {
    "url": "assets/js/10.9eb223f0.js",
    "revision": "b7470bfb44b8cdf43c58c4371170cd8f"
  },
  {
    "url": "assets/js/2.be3cc0f8.js",
    "revision": "50ee686e49329239f278577e5ba0d781"
  },
  {
    "url": "assets/js/3.cd0a6ffc.js",
    "revision": "3b43078f8aaf02a7f5dddeb66aee36b4"
  },
  {
    "url": "assets/js/4.140aac2e.js",
    "revision": "b66f5962b4ffaee3297f8ed1b28a6d8f"
  },
  {
    "url": "assets/js/5.0b51af88.js",
    "revision": "4302d0fc42bbb25fc03c7a977cd17f67"
  },
  {
    "url": "assets/js/6.1bc17ea5.js",
    "revision": "be0d4a4b015606c6baa34aa4d0ec79de"
  },
  {
    "url": "assets/js/7.9b98c8db.js",
    "revision": "2afa3ec4f1ad8e7beba5826b6ba7f0aa"
  },
  {
    "url": "assets/js/8.24dac6aa.js",
    "revision": "a2097779aba52abb478f2bc250ec62e6"
  },
  {
    "url": "assets/js/9.fcce7a57.js",
    "revision": "071a800913f065db06bef0ced7f42da8"
  },
  {
    "url": "assets/js/app.13f49cfa.js",
    "revision": "0453a7fb5edc069479b10c2c84abb3f6"
  },
  {
    "url": "guide/appManage.html",
    "revision": "391566ac033e33b13b32f6315cc56934"
  },
  {
    "url": "guide/deviceManage.html",
    "revision": "9be3971274f187a7f751aed3586fc537"
  },
  {
    "url": "guide/index.html",
    "revision": "909ccd9bb5b8f035a13d7d72700c5042"
  },
  {
    "url": "guide/onlineDebug.html",
    "revision": "e668b7cc72a1795ab3543e81f3e22a3e"
  },
  {
    "url": "guide/registerAndLogin.html",
    "revision": "0ccf57c9b8867072c6a6dbcaf6701d44"
  },
  {
    "url": "guide/secretManage.html",
    "revision": "3e0e2529575990c6df6af5a68e86b512"
  },
  {
    "url": "img/addApp.png",
    "revision": "704de9221e6133df7adf37d18e586059"
  },
  {
    "url": "img/addDevice.png",
    "revision": "4120146f284d014b4f0eb58edc3950f7"
  },
  {
    "url": "img/apiTest.png",
    "revision": "ec7e4065023b920ea29177466e4a35b2"
  },
  {
    "url": "img/appCallBack.png",
    "revision": "750352dee9db68cd95f6d8db1b9dfa71"
  },
  {
    "url": "img/appManage.png",
    "revision": "a92ecefea182542b7d23bfb8dcb7b67f"
  },
  {
    "url": "img/cat.jpg",
    "revision": "3ed87f552532da3c32fc1f31d07bd41a"
  },
  {
    "url": "img/coapInfo.png",
    "revision": "f664ca1d1882c85d8212430f828795a2"
  },
  {
    "url": "img/dashboard.png",
    "revision": "c8c6ad94eac4cb8c3fe47e24eb695051"
  },
  {
    "url": "img/deviceImport.png",
    "revision": "8a50da77e4b2df6d5b16f497046b0aeb"
  },
  {
    "url": "img/deviceManage.png",
    "revision": "00693811b61a181ce5e0516aa54029b7"
  },
  {
    "url": "img/lantrue.png",
    "revision": "5ff29bdab78678342227eb4aebc67225"
  },
  {
    "url": "img/login.png",
    "revision": "06bd8582745f952e0fb7867f3235b089"
  },
  {
    "url": "img/mqttInfo.png",
    "revision": "ca79882309a02a006a1d2a83f7ab3310"
  },
  {
    "url": "img/register.png",
    "revision": "1f09674326ebcd14f89cbd18fdaa3bb4"
  },
  {
    "url": "img/secretBond.png",
    "revision": "a24e17ee2402001d62e230adccd6b7b2"
  },
  {
    "url": "img/secretManage.png",
    "revision": "f9c7bc23a0101ca4658be75470612585"
  },
  {
    "url": "img/tcpInfo.png",
    "revision": "265bdb4606a25fb7395c9942872eb0e6"
  },
  {
    "url": "img/udpInfo.png",
    "revision": "04e1938b8b4984c47d6af6953e52e9ad"
  },
  {
    "url": "index.html",
    "revision": "2c00f7b5c630ea475e25ea27a3c857ea"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
addEventListener('message', event => {
  const replyPort = event.ports[0]
  const message = event.data
  if (replyPort && message && message.type === 'skip-waiting') {
    event.waitUntil(
      self.skipWaiting().then(
        () => replyPort.postMessage({ error: null }),
        error => replyPort.postMessage({ error })
      )
    )
  }
})
