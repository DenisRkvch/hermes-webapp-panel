// Hermes Telegram Mini App. Static; talks to Hermes only via Telegram.WebApp.sendData.
(function () {
  "use strict";
  var CATALOG = {
    status:   ["Статус", "сессия, модель, токены"],
    usage:    ["Usage", "токены и лимиты"],
    context:  ["Контекст", "заполнение окна"],
    agents:   ["Агенты", "активные задачи"],
    profile:  ["Профиль", "имя и каталог"],
    whoami:   ["Кто я", "уровень доступа"],
    help:     ["Помощь", "список команд"],
    new:      ["Новая сессия", "сброс истории", true],
    stop:     ["Стоп", "убить фоновые процессы", true],
    compress: ["Сжать", "компрессия контекста", true]
  };

  function allowedFromUrl(search) {
    var m = /[?&]cmds=([^&]*)/.exec(search || "");
    var list = m ? decodeURIComponent(m[1]).split(",") : ["status", "usage", "context", "agents", "profile", "whoami", "help"];
    return list.filter(function (c, i) { return CATALOG.hasOwnProperty(c) && list.indexOf(c) === i; });
  }

  function payload(cmd) { return JSON.stringify({ v: 1, cmd: cmd }); }

  if (typeof module !== "undefined") { module.exports = { allowedFromUrl: allowedFromUrl, payload: payload, CATALOG: CATALOG }; return; }

  var tg = window.Telegram && window.Telegram.WebApp;
  var box = document.getElementById("cmds");
  // sendData works only for Mini Apps opened from a reply-keyboard button (no initData query_id).
  if (!tg || !tg.initData) { document.getElementById("warn").hidden = false; }
  if (tg) { tg.ready(); tg.expand(); }

  allowedFromUrl(location.search).forEach(function (cmd) {
    var meta = CATALOG[cmd];
    var b = document.createElement("button");
    if (meta[2]) b.className = "danger";
    var t = document.createElement("b"); t.textContent = "/" + cmd + " · " + meta[0];
    var s = document.createElement("span"); s.textContent = meta[1];
    b.appendChild(t); b.appendChild(s);
    b.addEventListener("click", function () {
      if (!tg) return;
      var send = function () { tg.sendData(payload(cmd)); }; // closes the Mini App
      if (meta[2] && tg.showConfirm) tg.showConfirm("Выполнить /" + cmd + "?", function (ok) { if (ok) send(); });
      else send();
    });
    box.appendChild(b);
  });
})();
