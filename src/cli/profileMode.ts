import { select, text, log, isCancel } from '@clack/prompts'
import { System } from '../System'
import { Config } from '../Config'
import { addServer } from './addServer'

export const profileMode = async () => {
    const system = await System.load()

    let name: string

    name = (await select({
        message: 'Select a profile',
        options: [
            ...Object.entries(system.profiles).map(([key]) => ({
                value: key,
                label: key,
            })),
            { value: 'new', label: 'New profile' },
        ],
    })) as string

    if (name === 'new') {
        name = (await text({
            message: 'Enter a name for the new profile',
        })) as string
        system.profiles = {
            ...system.profiles,
            [name]: {},
        }
    }

    const profile = Object.entries(system.profiles).find(
        ([key]) => key === name
    )

    if (!profile) {
        throw new Error('Profile not found')
    }

    const [_, entry] = profile

    const config = new Config(name, entry)

    const action = await select({
        message: 'What do you want to do?',
        options: [
            { value: 'add', label: 'Add a server' },
            { value: 'list', label: 'List servers' },
            { value: 'remove', label: 'Remove a server' },
        ],
    })

    switch (action) {
        case 'add':
            const server = await addServer()
            if (!server) {
                log.error('Server not found')
                break
            }
            config.addServer(server)
            break
        case 'list':
            log.info(
                config
                    .listServers()
                    .map(([key]) => key)
                    .join('\n')
            )
            break
        case 'remove':
            const removeName = await select({
                message: 'Select a server to remove',
                options: config.listServers().map(([key]) => ({
                    value: key,
                    label: key,
                })),
            })
            config.removeServer(removeName as string)
            break
    }

    await system.save()
}
