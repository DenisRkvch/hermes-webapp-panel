# Hermes Telegram Mini App panel

`docs/` — static panel for GitHub Pages (Settings → Pages → branch `main`, folder `/docs`).
Plugin — `~/.hermes/plugins/telegram-webapp-panel/`.

Flow: `/panel` in a private chat → reply-keyboard WebApp button → user taps a command →
`Telegram.WebApp.sendData('{"v":1,"cmd":"status"}')` → `web_app_data` service message →
plugin validates (private chat, gateway auth, optional `allowed_users`, command allowlist, no args) →
dispatched as `/status` through the normal gateway pipeline.

## Enable
```
hermes config set plugins.entries.telegram-webapp-panel.settings.url https://<user>.github.io/<repo>/
hermes plugins enable telegram-webapp-panel
# optional: settings.allowed_commands [status,usage,new], settings.allowed_users [<tg id>]
# then restart the gateway (picks up the Telegram handler)
```
Default commands (read-only): status usage context agents profile whoami help.
Opt-in (mutating, confirmed in UI): new stop compress.

## Tests
```
VENV_PY tests/test_panel.py   # in the plugin dir, gateway venv python
```
