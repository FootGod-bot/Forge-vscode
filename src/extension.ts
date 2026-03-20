import * as vscode from "vscode"
import * as commands from "./commands"
import { RunningProject } from "./serveProject"
import { updateButton } from "./updateButton"
import { CruciblePackagesProvider } from "./cruciblePackages"

export type State = {
  resumeButton: vscode.StatusBarItem
  running: { [index: string]: RunningProject }
  context: vscode.ExtensionContext
}

let cleanup: undefined | (() => void)
let configurationDisposable: vscode.Disposable | undefined

export function activate(context: vscode.ExtensionContext) {
  console.log("vscode-crucible activated")

  // Check if the official Rojo extension is installed
  const rojoExtension = vscode.extensions.getExtension('evaera.vscode-rojo')
  if (rojoExtension) {
    vscode.window.showErrorMessage(
      'Crucible cannot be activated while the official Rojo extension is installed. ' +
      'Please uninstall the official Rojo extension (evaera.vscode-rojo) before using Crucible.',
      'Open Extensions'
    ).then(selection => {
      if (selection === 'Open Extensions') {
        vscode.commands.executeCommand('workbench.extensions.action.showExtensionsWithIds', ['evaera.vscode-rojo'])
      }
    })
    throw new Error('Official Rojo extension detected - Crucible cannot activate')
  }

  const state: State = {
    resumeButton: vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      199
    ),
    running: {},
    context,
  }

  const button = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    200
  )
  button.command = "vscode-rojo.openMenu"
  button.text = "$(rocket) Rojo"
  button.show()

  updateButton(state)
  state.resumeButton.show()

  context.subscriptions.push(
    ...Object.values(commands).map((command) => command(state))
  )

  // Register Crucible Packages tree view
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]
  if (workspaceFolder) {
    const cruciblePackagesProvider = new CruciblePackagesProvider(workspaceFolder.uri.fsPath)
    vscode.window.registerTreeDataProvider('cruciblePackages', cruciblePackagesProvider)

    // Register remove package command
    const removePackageCommand = vscode.commands.registerCommand('vscode-crucible.removePackage', async (packageItem) => {
      if (packageItem) {
        await cruciblePackagesProvider.removePackage(packageItem)
      }
    })
    context.subscriptions.push(removePackageCommand)

    // Register refresh command
    const refreshCommand = vscode.commands.registerCommand('vscode-crucible.refreshPackages', () => {
      cruciblePackagesProvider.refresh()
    })
    context.subscriptions.push(refreshCommand)

    // Register add package command
    const addPackageCommand = vscode.commands.registerCommand('vscode-crucible.addPackage', async () => {
      await cruciblePackagesProvider.addPackage()
    })
    context.subscriptions.push(addPackageCommand)

    // Dispose of the provider when extension deactivates
    context.subscriptions.push({
      dispose: () => cruciblePackagesProvider.dispose()
    })
  }

  configurationDisposable = vscode.workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration("rojo.additionalProjectPaths")) {
      console.log("rojo.additionalProjectPaths configuration changed")
      
      vscode.window.showInformationMessage(
        "Rojo: Additional project paths updated. New paths will be searched when opening the project menu.",
        { modal: false }
      )
    }
  })

  context.subscriptions.push(configurationDisposable)

  cleanup = () => {
    for (const runningProject of Object.values(state.running)) {
      runningProject.stop()
    }
  }

  if (
    context.globalState.get("news::rojo7") ||
    context.globalState.get("news::multipleProjectFiles")
  ) {
    vscode.window
      .showInformationMessage(
        "The Rojo extension has received a major upgrade. We recommend reading the extension description page.",
        "Open extension page",
        "Don't show this again"
      )
      .then((option) => {
        if (!option) {
          return
        }

        if (option?.includes("Open")) {
          vscode.env.openExternal(
            vscode.Uri.from({
              scheme: vscode.env.uriScheme,
              path: "extension/evaera.vscode-rojo",
            })
          )
        }

        context.globalState.update("news::rojo7", undefined)
        context.globalState.update("news::multipleProjectFiles", undefined)
      })
  }
}

export function deactivate() {
  if (cleanup) {
    cleanup()
    cleanup = undefined
  }

  if (configurationDisposable) {
    configurationDisposable.dispose()
    configurationDisposable = undefined
  }
}
