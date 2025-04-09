import { configSchema, type ConfigType, type ServerType } from "./types";
import { join } from "path";
import { homedir } from "os";

export class Config {
    private config!: ConfigType;
    public path: string;
    public client: string;

    constructor(name: string, client: string) {
        this.client = client;
        switch (name) {
            case 'claude':
                this.path = join(homedir(), 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
                break;
            case 'cursor':
                this.path = join(homedir(), '.cursor', 'mcp.json');
                break;
            default:
                throw new Error('Unsupported MCP client')
        }
        this.load();
    }

    private async load() {
        try {
            const file = await Bun.file(this.path).text();
            const json = JSON.parse(file);
            const config = configSchema.parse(json);
            this.config = config;
        } catch (error) {
            console.error('Error loading config:', error);
            throw error;
        }
    }

    public async save() {
        try {
            await Bun.write(this.path, JSON.stringify(this.config, null, 2));
        } catch (error) {
            console.error('Error saving config:', error);
            throw error;
        }
    }

    public addServer(name: string, server: ServerType) {
        this.config.mcpServers[name] = server;
    }

    public listServers() {
        return this.config.mcpServers;
    }

    public removeServer(name: string) {
        delete this.config.mcpServers[name];
    }
}