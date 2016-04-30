"use strict";

const { classes: Cc, interfaces: Ci, utils: Cu } = Components;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("resource://gre/modules/XPCOMUtils.jsm");

XPCOMUtils.defineLazyGetter(this, "Strings", function() {
  return Services.strings.createBundle("chrome://savepage/locale/strings.properties");
});

XPCOMUtils.defineLazyModuleGetter(this, "Log", "resource://gre/modules/AndroidLog.jsm", "AndroidLog");

function log(msg) {
  Log.d("SavePage", msg);
}

var gMenuId;

function loadIntoWindow(window) {
  gMenuId = window.NativeWindow.menu.add({
    name: Strings.GetStringFromName("menu.savePage"),
    parent: window.NativeWindow.menu.toolsMenuID,
    callback: function() {
      // TODO: Figure out where this file is actually saved.
      window.ContentAreaUtils.saveBrowser(window.BrowserApp.selectedBrowser, true);
    }
  });
}

function unloadFromWindow(window) {
  window.NativeWindow.menu.remove(gMenuId);
}

/**
 * bootstrap.js API
 */
var windowListener = {
  onOpenWindow: function(window) {
    // Wait for the window to finish loading
    function loadListener() {
      window.removeEventListener("load", loadListener, false);
      loadIntoWindow(window);
    };
    window.addEventListener("load", loadListener, false);
  },

  onCloseWindow: function(window) {
  },

  onWindowTitleChange: function(window, title) {
  }
};

function startup(data, reason) {
  let window = Services.wm.getMostRecentWindow("navigator:browser");
  if (window) {
    loadIntoWindow(window);
  }
  Services.wm.addListener(windowListener);
}

function shutdown(data, reason) {
  Services.wm.removeListener(windowListener);
  unloadFromWindow(Services.wm.getMostRecentWindow("navigator:browser"));
}

function install(data, reason) {}

function uninstall(data, reason) {}
