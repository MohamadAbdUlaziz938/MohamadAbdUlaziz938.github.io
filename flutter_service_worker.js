'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/app-config.yaml": "0e073cfac641bd9b4f1a323bd10d6d86",
"assets/AssetManifest.json": "8046ba12380aa1fd8ac3484bc773283e",
"assets/assets/form.json": "1d7c94d72a971495b3012093d9888c70",
"assets/assets/form2.json": "2db8e4481fc7cfb71a92b0204ff013a0",
"assets/assets/form3.json": "bbf7a24588b835e85cb9cfa2cace2071",
"assets/assets/form4.json": "53f0ccc18a35a07779547c3dc61e7812",
"assets/assets/icons/default-file-custom.svg": "a5125d547956f428c73582f67c38fd16",
"assets/assets/icons/form.png": "d3a8710398615ddb9675ea965aadc636",
"assets/assets/icons/logo.png": "2a834d267df4d22f70e409110f372b86",
"assets/assets/icons/logo2.png": "650cf92a3b845fc8a7d8d28343ef28fd",
"assets/assets/icons/logo_maktabi.png": "396ae115c658b7429bf8bf6b6d5bd7d5",
"assets/assets/icons/menu.png": "c7e42eb49950b9a1b8e4769d3e748bd0",
"assets/assets/icons/no-connection.svg": "16e29354d6b8b6e51a0547a0c66d710d",
"assets/assets/icons/no_result.png": "2ab973692dc0e877442a70d84ff5b375",
"assets/assets/icons/syria.png": "46ad50c79a416040ee7641c597488066",
"assets/assets/icons/upload-custom.svg": "7bda147c8dc2012882b1ec293dc4f85c",
"assets/assets/icons/warning-cyit.svg": "f67c3275d95bf2735a0cef5682eec0cf",
"assets/assets/images/bottom1.png": "6b84f28383721d9658f43202fc05df65",
"assets/assets/images/bottom2.png": "d75870ab4305146f8f4098192422a4d2",
"assets/assets/images/default-image.jpg": "e59b9fcda94af59885e3b2c949648e9f",
"assets/assets/images/top1.png": "b080bce9f5b1ea61f79200807d3d154d",
"assets/assets/images/top2.png": "5ba82c2d5a07482a351172f7b5ebcfb7",
"assets/assets/logos/madarat_logo.png": "42a6bfe372ed632fbf190118441ecc25",
"assets/assets/logos/madarat_logo_rotate.png": "69dc950674bdd340121c9053b2963efd",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/NOTICES": "e91fce8e3db809af36bcde02450749f3",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"canvaskit/canvaskit.js": "43fa9e17039a625450b6aba93baf521e",
"canvaskit/canvaskit.wasm": "04ed3c745ff1dee16504be01f9623498",
"canvaskit/profiling/canvaskit.js": "f3bfccc993a1e0bfdd3440af60d99df4",
"canvaskit/profiling/canvaskit.wasm": "a9610cf39260f60fbe7524a785c66101",
"favicon.png": "c98c47ea52f2f786d189b6018a674556",
"icons/apple-touch-icon.png": "be24f86059b3bf59fedfc472eba7fefc",
"icons/favicon-16x16.png": "f3c22c5dbec66d921157877003813a14",
"icons/favicon-32x32.png": "c98c47ea52f2f786d189b6018a674556",
"icons/Icon-1922.png": "ada61d75a936542dd4dd7d98c8204614",
"icons/Icon-5122.png": "6225338c27a135dbefb34fb430bb4d84",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"index.html": "b906df1818a800645af1d291b9902580",
"/": "b906df1818a800645af1d291b9902580",
"main.dart.js": "d3dc89638a51db16eb2738ec58c04c58",
"manifest.json": "09c8e0562d20e73dde75224f311cd944",
"version.json": "aaac14d29fc005dce260b35cc34f158d"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
