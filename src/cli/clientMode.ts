import { isCancel, log, select, text } from '@clack/prompts'
import { defaultClients } from '../utils'
import { Client } from '../Client'
import { addServer } from './addServer'
import { selectProfile } from './selectProfile'
import { System } from '../System'

export const clientMode = async () => {
    const available = await defaultClients()

    const selected = await select({
        message: 'Select a client',
        options: available.map((c) => ({
            value: c,
            label: c.label,
        })),
    })
    if (typeof selected === 'symbol') {
        throw new Error('Client not found')
    }

    const client = await Client.load(
        selected.path,
        selected.jsonKey,
        selected.name
    )

    const action = await select({
        message: 'What do you want to do?',
        options: [
            { value: 'add', label: 'Add a server' },
            { value: 'list', label: 'List servers' },
            { value: 'remove', label: 'Remove a server' },
            { value: 'use', label: 'Use a profile' },
            { value: 'restart', label: 'Restart the client' },
        ],
    })

    switch (action) {
        case 'add':
            const server = await addServer()
            if (!server) {
                log.error('Server not found')
                break
            }
            client.addServer(server)
            break
        case 'list':
            if (client.listServers().length === 0) {
                log.warn('No servers found')
                break
            }
            log.info(
                client
                    .listServers()
                    .map(([key]) => key)
                    .join('\n')
            )
            break
        case 'use':
            const profile = await selectProfile()
            if (!profile) {
                log.error('Profile not found')
                break
            }
            client.setConfig(profile)
            break
        case 'remove':
            const removeName = await select({
                message: 'Select a server to remove',
                options: client.listServers().map(([key]) => ({
                    value: key,
                    label: key,
                })),
            })
            client.removeServer(removeName as string)
            break
        case 'restart':
            break
    }

    await client.save()

    const system = await System.load()

    system.clients[selected.name] = client

    await system.save()
}
