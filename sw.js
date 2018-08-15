importScripts('workbox-sw.prod.v2.1.1.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "www/assets/css/default.css",
    "revision": "ae4b6cc0a969922f68114dd8730929d7"
  },
  {
    "url": "www/assets/css/docker.css",
    "revision": "ba6b99adb94d1d745f762493617e69c7"
  },
  {
    "url": "www/assets/css/spinner.css",
    "revision": "863ea9521c159961567ad5918574b5ab"
  },
  {
    "url": "www/assets/fonts/MaterialIcons-Regular.woff2",
    "revision": "570eb83859dc23dd0eec423a49e147fe"
  },
  {
    "url": "www/assets/img/logo.png",
    "revision": "1431a5c03eb1271c6a3c4d7ea8264da1"
  },
  {
    "url": "www/assets/img/searca-logo.png",
    "revision": "958e4eb48d21376784c4640bfc6abb4b"
  },
  {
    "url": "www/assets/img/searca-new.png",
    "revision": "a3da8712e9c72b8d6239a563c17ed267"
  },
  {
    "url": "www/assets/img/share.png",
    "revision": "a2fe42e8edefe76e97ac11e99c69f265"
  },
  {
    "url": "www/assets/js/exports.js",
    "revision": "b6ef6c8b72c537383c727bd64eb992a6"
  },
  {
    "url": "www/assets/js/shell.js",
    "revision": "bd7daf5f19e8ac21bcfcae8861844057"
  },
  {
    "url": "www/index.html",
    "revision": "e6637f36bebebb15959ad2d179135de4"
  },
  {
    "url": "www/pages/welcome.html",
    "revision": "01b1fccb4eb253ed443cae6f18695176"
  },
  {
    "url": "www/spec.html",
    "revision": "12366a1aaa83c60e50efecfe54f664b1"
  }
];

const workboxSW = new self.WorkboxSW({skipWaiting: true, clientsClaim: true});
workboxSW.precache(fileManifest);
