import { ConfigType, ServerType } from './types'

export class Config {
    public name: string
    public config: ConfigType

    constructor(name: string, config: ConfigType) {
        this.name = name
        this.config = config
    }

    public addServer(server: { name: string; config: ServerType }) {
        this.config[server.name] = server.config
    }

    public listServers() {
        return Object.entries(this.config)
    }

    public removeServer(name: string) {
        delete this.config[name]
    }

    public setConfig(config: ConfigType) {
        this.config = config
    }
}
