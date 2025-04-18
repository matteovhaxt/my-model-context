import { join } from 'path'
import { homedir } from 'os'
import { readFile, writeFile } from 'fs/promises'
import {
    systemSchema,
    type SystemType,
    type ClientType,
    type ProfileType,
} from './types'
import { fileExists } from './utils'

export class System {
    private system!: SystemType

    static readonly path = join(homedir(), '.my-model-context.json')

    constructor(system: SystemType) {
        this.system = system
    }

    static async load() {
        try {
            const exists = await fileExists(System.path)
            if (!exists) {
                return new System({
                    clients: [],
                    profiles: [],
                })
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

    public addClient(client: ClientType) {
        this.system.clients.push(client)
    }

    public removeClient(client: string) {
        const newClients = this.system.clients.filter((c) => c.name !== client)
        this.system.clients = newClients
    }

    public get profiles() {
        return this.system.profiles
    }

    public addProfile(profile: ProfileType) {
        this.system.profiles.push(profile)
    }

    public removeProfile(profile: string) {
        const newProfiles = this.system.profiles.filter(
            (p) => p.name !== profile
        )
        this.system.profiles = newProfiles
    }
}
