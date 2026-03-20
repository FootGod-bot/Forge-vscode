# Notice
This mod uses the source of the rojo vs-code extention, and slightly modifiys it. Instead of installing via aftman, it now installs Crucible and rojo via rokit. It also runs crucible init, not rojo init. Otherwise the rojo part is the exact same

# Rojo intigration
Integrates [Rojo](https://github.com/rojo-rbx/rojo) natively with VS Code.

![Rojo menu](https://github.com/FootGod-bot/Forge-vscode/blob/main/assets/rojo-menu.png?raw=true)

All actions are performed via the Rojo menu, as seen above. To open the Rojo menu, either:

- Open the Command Pallette (`Ctrl` + `Shift` + `P`) and type "Rojo: Open menu"
- Use the Rojo button in the bottom right corner:

![Rojo button](https://github.com/FootGod-bot/Forge-vscode/blob/main/assets/rojo-button.png?raw=true)

> Note: The Rojo button only appears if a folder in your workspace contains a `*.project.json` file.

# Crucible intigration
Integrates [Crucible](https://github.com/footgod-bot/crucible) nativly with VS Code

![Crucible menu](https://github.com/FootGod-bot/Forge-vscode/blob/main/assets/package-menu.png?raw=true)

As you can see, your packages appear in a tab on the bottom of the explorer. There are also three buttons.

![Plus button](https://github.com/FootGod-bot/Forge-vscode/blob/main/assets/plus-button.png?raw=true)

The plus button, which shows a menu asking you to give the path to a .crucible file (in the format of a local path, a remote download url, or a github repo in format user/repo)

![Refresh button](https://github.com/FootGod-bot/Forge-vscode/blob/main/assets/refresh-button.png?raw=true)

The refresh button is there if the system does not automaticly refresh. It refreshes the package list.

![Remove-button](https://github.com/FootGod-bot/Forge-vscode/blob/main/assets/remove-button.png?raw=true)

If you select a package, then click remove, the package will be removed.

## Automatic installation

If you do not have Rojo installed, the extension will ask you if you want it to be automatically installed for you. If you do, it will be installed via [Rokit](https://github.com/rojo-rbx/rokit), a toolchain manager made by the people who made rojo. It just adds rojo and crucible to the repo

You must click "Install Roblox Studio plugin" at least once if you want to live-sync from Studio!

## System files

This extension uses `rojo.exe` and `crucible.exe` in your path. If you get a error like the following, please know that is normal. Rokit needs you to trust a install first, and the extention does not do that.

![Error message](https://github.com/FootGod-bot/Forge-vscode/blob/main/assets/error-message.png?raw=true)

To fix this error if you get it, run the following commands once, and trust the repo's

```bash
rokit add rojo
rokit add footgod-bot/crucible
```

## New install methods
In the future I plan on adding a aftman method to install crucible.

## Help me with rojo!

- Read the [Rojo docs](https://rojo.space/docs/v7/)
- Join the [Roblox Open Source Discord Server](https://discord.gg/wH5ncNS)

## Supported platforms

- Windows

## License

Rojo for VS Code is available under the terms of The Mozilla Public License Version 2. See [LICENSE](LICENSE) for details.


Crucible for VS Code is available under the terms of The Mozilla Public License Version 2. See [LICENSE](LICENSE) for details.