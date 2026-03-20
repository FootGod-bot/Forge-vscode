# Notice
This mod uses the source of the rojo vs-code extention, and slightly modifiys it. Instead of installing via aftman, it now installs Crucible and rojo via rokit. It also runs crucible init, not rojo init. Otherwise the rojo part is the exact same
# Rojo intigration
Integrates [Rojo](https://github.com/rojo-rbx/rojo) natively with VS Code.

![Rojo menu](https://i.eryn.io/2222/chrome-DdVyGHdh.png)

All actions are performed via the Rojo menu, as seen above. To open the Rojo menu, either:

- Open the Command Pallette (`Ctrl` + `Shift` + `P`) and type "Rojo: Open menu"
- Use the Rojo button in the bottom right corner:

![Rojo button](https://i.eryn.io/2222/dHvsUY6w.png)

> Note: The Rojo button only appears if a folder in your workspace contains a `*.project.json` file.

## Automatic installation

If you do not have Rojo installed, the extension will ask you if you want it to be automatically installed for you. If you do, it will be installed via [Rokit](https://github.com/rojo-rbx/rokit), a toolchain manager made by the people who made rojo. It just adds rojo and crucible to the repo

You must click "Install Roblox Studio plugin" at least once if you want to live-sync from Studio!

## System files

This extension uses `rojo.exe` and `crucible.exe` in your path. If you get a error like the following, please know that is normal. Rokit needs you to trust a install first, and the extention does not do that

## New install methods
In the future I plan on adding a aftman method to install crucible.

## Help me!

- Read the [Rojo docs](https://rojo.space/docs/v7/)
- Join the [Roblox Open Source Discord Server](https://discord.gg/wH5ncNS)

## Supported platforms

- Windows

## License

Rojo for VS Code is available under the terms of The Mozilla Public License Version 2. See [LICENSE](LICENSE) for details.
