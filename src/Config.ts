import { configSchema, type ConfigType, type ServerType } from './types'
import { join } from 'path'
import { homedir } from 'os'
import { readFile, writeFile } from 'fs/promises'

export class Config {
    private config!: ConfigType
    public path: string
    public client: 'claude' | 'cursor' | 'windsurf'

    constructor(client: 'claude' | 'cursor' | 'windsurf') {
        this.client = client
        switch (client) {
            case 'claude':
                this.path = join(
                    homedir(),
                    'Library',
                    'Application Support',
                    'Claude',
                    'claude_desktop_config.json'
                )
                break
            case 'cursor':
                this.path = join(homedir(), '.cursor', 'mcp.json')
                break
            case 'windsurf':
                this.path = join(
                    homedir(),
                    '.codeium',
                    'windsurf',
                    'mcp_config.json'
                )
                break
            default:
                throw new Error('Unsupported MCP client')
        }
        this.load()
    }

    private async load() {
        try {
            const file = await readFile(this.path, 'utf-8')
            const json = JSON.parse(file)
            const config = configSchema.parse(json)
            this.config = config
        } catch (error) {
            console.error('Error loading config:', error)
            throw error
        }
    }

    public async save() {
        try {
            await writeFile(this.path, JSON.stringify(this.config, null, 2))
        } catch (error) {
            console.error('Error saving config:', error)
            throw error
        }
    }

    public addServer(name: string, server: ServerType) {
        this.config[name] = server
    }

    public listServers() {
        return this.config
    }

    public removeServer(name: string) {
        delete this.config[name]
    }
}
