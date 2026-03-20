import * as fs from "fs/promises"
import * as path from "path"
import * as vscode from "vscode"
import { promisify } from "util"
import * as childProcess from "child_process"

const exec = promisify(childProcess.exec)

export interface CruciblePackage {
  name: string
  id: string
  filePath: string
}

export class CruciblePackagesProvider implements vscode.TreeDataProvider<CruciblePackage> {
  private _onDidChangeTreeData: vscode.EventEmitter<CruciblePackage | undefined | null | void> = new vscode.EventEmitter<CruciblePackage | undefined | null | void>()
  readonly onDidChangeTreeData: vscode.Event<CruciblePackage | undefined | null | void> = this._onDidChangeTreeData.event
  private refreshInterval: NodeJS.Timeout | undefined

  constructor(private workspaceRoot: string) {
    // Auto-refresh the tree every 5 seconds
    this.refreshInterval = setInterval(() => {
      this.refresh()
    }, 5000)
  }

  dispose(): void {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  }

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: CruciblePackage): vscode.TreeItem {
    return {
      label: element.name,
      tooltip: `Package: ${element.name}`,
      contextValue: "cruciblePackage",
      iconPath: new vscode.ThemeIcon("package"),
      command: undefined,
    }
  }

  getChildren(element?: CruciblePackage): Thenable<CruciblePackage[]> {
    if (!this.workspaceRoot) {
      return Promise.resolve([])
    }

    if (element) {
      return Promise.resolve([])
    }

    return this.getCruciblePackages()
  }

  private async getCruciblePackages(): Promise<CruciblePackage[]> {
    const crucibleFolder = path.join(this.workspaceRoot, ".crucible")
    const logsFolder = path.join(crucibleFolder, "logs")

    try {
      const files = await fs.readdir(logsFolder)
      const jsonFiles = files.filter(file => file.endsWith(".json"))

      const packages: CruciblePackage[] = []

      for (const file of jsonFiles) {
        try {
          const filePath = path.join(logsFolder, file)
          const content = await fs.readFile(filePath, "utf8")
          const data = JSON.parse(content)

          if (data.name) {
            packages.push({
              name: data.name,
              id: file.replace(".json", ""),
              filePath: filePath
            })
          }
        } catch (error) {
          // Skip files that can't be parsed
          console.error(`Error parsing ${file}:`, error)
        }
      }

      return packages
    } catch (error) {
      // If .crucible/logs doesn't exist, return empty array
      return []
    }
  }

  async removePackage(packageItem: CruciblePackage): Promise<void> {
    try {
      await exec(`crucible remove --silent ${packageItem.id}`, {
        cwd: this.workspaceRoot
      })

      // Refresh the tree view
      this.refresh()

      vscode.window.showInformationMessage(`Successfully removed package: ${packageItem.name}`)
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to remove package ${packageItem.name}: ${error}`)
    }
  }

  async addPackage(): Promise<void> {
    const input = await vscode.window.showInputBox({
      prompt: "Enter package path or URL",
      placeHolder: "e.g., ./path/to/package, https://example.com/file, owner/repo",
      validateInput: (value: string) => {
        if (!value) {
          return "Package path or URL is required"
        }

        // Check if it's a local path (starts with ./ or ../ or is an absolute path with letters/backslashes)
        const isLocalPath = /^\.[\\/]|^\.\.[\\/]|^[a-zA-Z]:[\\/]|^[\\/]/.test(value)

        // Check if it's a URL (starts with http:// or https://)
        const isUrl = /^https?:\/\//.test(value)

        // Check if it's in owner/repo format
        const isOwnerRepo = /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(value)

        if (isLocalPath || isUrl || isOwnerRepo) {
          return undefined
        }

        return "Invalid format. Use local path (./), URL (http/https), or owner/repo format"
      }
    })

    if (!input) {
      return
    }

    try {
      await exec(`crucible add "${input}" --silent`, {
        cwd: this.workspaceRoot
      })

      // Refresh the tree view
      this.refresh()

      vscode.window.showInformationMessage(`Successfully added package: ${input}`)
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to add package ${input}: ${error}`)
    }
  }
}
