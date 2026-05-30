window.browser = {

  getInnerWidth: function () {
    return window.innerWidth;
  }
}

window.localStorageHelper = {
  getItem: function (key) {
    return localStorage.getItem(key);
  },
  setItem: function (key, value) {
    localStorage.setItem(key, value);
  }
}
