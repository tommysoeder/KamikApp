import fs from "node:fs";
import vm from "node:vm";

const appElement = {
  innerHTML: "",
  addEventListener() {},
};

const modalElement = { innerHTML: "" };

const context = {
  console,
  Date,
  Math,
  URLSearchParams,
  confirm() {
    return true;
  },
  localStorage: {
    value: null,
    getItem() {
      return this.value;
    },
    setItem(_key, value) {
      this.value = value;
    },
    removeItem() {},
  },
  navigator: {},
  window: {
    location: { search: "?view=desktop" },
    requestAnimationFrame(callback) {
      callback();
    },
    scrollTo() {},
    clearInterval() {},
    setInterval() {},
    addEventListener() {},
    removeEventListener() {},
    clearTimeout() {},
    setTimeout() {},
  },
  document: {
    body: { classList: { toggle() {} } },
    querySelector(selector) {
      if (selector === "#app") return appElement;
      if (selector === "#modal-root") return modalElement;
      if (selector === ".main" || selector === ".content") return { scrollTo() {} };
      return { addEventListener() {}, innerHTML: "", value: "", classList: { toggle() {} } };
    },
    addEventListener() {},
  },
};

vm.createContext(context);
vm.runInContext(fs.readFileSync("app.js", "utf8"), context, { filename: "app.js" });
vm.runInContext("state.session = { userId: 'u-director', email: 'direccion@club.test', activeRole: 'director' };", context);

const views = ["dashboard", "management", "calendar", "results", "documents", "profiles", "users", "diagnostics"];
for (const view of views) {
  vm.runInContext(`state.activeView = "${view}"; render();`, context, { filename: `visual-${view}.js` });
  if (!appElement.innerHTML || appElement.innerHTML.includes("undefined")) {
    throw new Error(`Visual smoke failed for ${view}`);
  }
}

const css = fs.readFileSync("styles.css", "utf8");
if (!css.includes("V80 - desktop density pass") || !css.includes("@media (min-width: 981px)") || !css.includes("@media (max-width: 980px)")) {
  throw new Error("Responsive density rules are missing");
}

console.log("Visual smoke test passed");
