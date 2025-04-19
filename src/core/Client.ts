import { configSchema, type ConfigType } from '../types'
import { readFile, writeFile } from 'fs/promises'
import { fileExists } from '../utils'
import { Config } from './Config'

export class Client extends Config {
    public path: string
    public jsonKey: string

    constructor(
        name: string,
        config: ConfigType,
        path: string,
        jsonKey: string
    ) {
        super(name, config)
        this.path = path
        this.jsonKey = jsonKey
    }

    static async load(path: string, jsonKey: string, name: string) {
        try {
            const exists = await fileExists(path)
            if (!exists) {
                const client = new Client(name, {}, path, jsonKey)
                await client.save()
                return client
            }
            const file = await readFile(path, 'utf-8')
            const json = JSON.parse(file)
            const config = configSchema.parse(json[jsonKey])
            return new Client(name, config, path, jsonKey)
        } catch (error) {
            console.error('Error loading config:', error)
            throw error
        }
    }

    public async save() {
        try {
            await writeFile(
                this.path,
                JSON.stringify(
                    {
                        [this.jsonKey]: this.config,
                    },
                    null,
                    2
                )
            )
        } catch (error) {
            console.error('Error saving config:', error)
            throw error
        }
    }
}
