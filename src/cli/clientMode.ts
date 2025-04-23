import { isCancel, log, select, spinner, text } from '@clack/prompts'
import { defaultClients } from '../utils'
import { Client } from '../core/Client'
import { addServer } from './addServer'
import { selectProfile } from './selectProfile'
import { System } from '../core/System'
import { restartClient } from './restartClient'

export const clientMode = async () => {
    const available = await defaultClients()

    while (true) {
        const selected = await select({
            message: 'Select a client',
            options: available.map((c) => ({
                value: c,
                label: c.label,
            })),
        })
        if (isCancel(selected)) {
            break
        }

        const client = await Client.load(
            selected.path,
            selected.jsonKey,
            selected.name,
            selected.process
        )

        while (true) {
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
            if (isCancel(action)) {
                break
            }

            switch (action) {
                case 'add':
                    const server = await addServer()
                    if (!server) {
                        log.error('Exited')
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
                        log.error('Exited')
                        break
                    }
                    client.setConfig(profile)
                    break
                case 'remove':
                    const clients = client.listServers()
                    if (clients.length === 0) {
                        log.warn('No servers found')
                        break
                    }
                    const removeName = await select({
                        message: 'Select a server to remove',
                        options: clients.map(([key]) => ({
                            value: key,
                            label: key,
                        })),
                    })
                    if (isCancel(removeName)) {
                        log.error('Exited')
                        break
                    }
                    client.removeServer(removeName as string)
                    break
                case 'restart':
                    await restartClient(client)
                    break
            }
        }

        await client.save()

        const system = await System.load()

        system.clients[selected.name] = client

        await system.save()
    }
}
