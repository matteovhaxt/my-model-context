import { log, select, text } from '@clack/prompts'
import { defaultClients } from '../utils'
import { Client } from '../Client'
import { System } from '../System'

export const client = async () => {
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

    const system = await System.load()

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
            const addName = await text({
                message: 'Enter a name for the server',
            })
            const cmd = await text({
                message: 'Enter the start command',
            })
            const args = (cmd as string).split(' ')
            client.addServer(addName as string, {
                command: args[0],
                args: args.slice(1),
                env: {},
                settings: {},
            })
            break
        case 'list':
            log.info(
                client
                    .listServers()
                    .map(([key]) => key)
                    .join('\n')
            )
            break
        case 'use':
            const profiles = Object.entries(system.profiles)
            if (profiles.length === 0) {
                log.warn('No profiles found')
                break
            }
            const profileName = await select({
                message: 'Select a profile',
                options: profiles.map(([key]) => ({
                    value: key,
                    label: key,
                })),
            })
            const profile = profiles.find(([key]) => key === profileName)
            if (!profile) {
                log.error('Profile not found')
                break
            }
            const [_, config] = profile
            client.setConfig(config)
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
}
