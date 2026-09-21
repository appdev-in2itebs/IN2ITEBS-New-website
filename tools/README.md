# tools/ — local tunnel tooling for run.bat

`run.bat` (at the repository root) builds the site, serves it on http://127.0.0.1:3107 and opens a
public ngrok link so anyone can review it. Everything it needs lives here.

| File | Committed? | Purpose |
| --- | --- | --- |
| `ngrok.example.yml` | yes | Template for the agent config. Copy it to `ngrok.yml` and add your token. |
| `ngrok.yml` | **no** (git-ignored) | Your real agent config with the account authtoken. |
| `ngrok-domain.txt` | **no** (git-ignored) | Optional. One line with a reserved ngrok hostname (no `https://`), e.g. `in2it-ebs.ngrok-free.app`, so the public link is the same every run. |
| `ngrok.exe` | **no** (git-ignored) | The agent binary. `run.bat` downloads it on first run (about 33 MB). |

## First-time setup

1. Sign in at https://dashboard.ngrok.com and copy the authtoken from **Your Authtoken**.
2. `copy tools\ngrok.example.yml tools\ngrok.yml` and paste the token in place of
   `YOUR_NGROK_AUTHTOKEN_HERE`.
3. Optional: reserve a domain in the ngrok dashboard and put its hostname in `tools\ngrok-domain.txt`.
4. Double-click `run.bat`. The link is printed, copied to the clipboard and opened in the browser.

The tunnel only works while the two windows `run.bat` opens stay open. Port 4141 is the agent's
inspector; port 3000 and its tunnel belong to another project on the same machines and are never
touched.
