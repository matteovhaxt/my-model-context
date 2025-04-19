import { join } from 'path'
import { readFile, writeFile } from 'fs/promises'
import {
    systemSchema,
    type ClientType,
    type ConfigType,
    type SystemType,
} from '../types'
import { fileExists } from '../utils'
import { homedir } from 'os'

export class System {
    public system: SystemType

    static readonly path = join(homedir(), '.my-model-context.json')

    constructor(system: SystemType) {
        this.system = system
    }

    static async load() {
        try {
            const exists = await fileExists(System.path)
            if (!exists) {
                const system = new System({
                    clients: {},
                    profiles: {},
                })
                await system.save()
                return system
            }
            const file = await readFile(System.path, 'utf-8')
            const json = JSON.parse(file)
            const parsed = systemSchema.parse(json)
            return new System(parsed)
        } catch (error) {
            console.error('Error loading system:', error)
            throw error
        }
    }

    public async save() {
        try {
            await writeFile(System.path, JSON.stringify(this.system, null, 2))
        } catch (error) {
            console.error('Error saving system:', error)
            throw error
        }
    }

    public get clients() {
        return this.system.clients
    }

    public set clients(clients: Record<string, ClientType>) {
        this.system.clients = clients
    }

    public get profiles() {
        return this.system.profiles
    }

    public set profiles(profiles: Record<string, ConfigType>) {
        this.system.profiles = profiles
    }
}
