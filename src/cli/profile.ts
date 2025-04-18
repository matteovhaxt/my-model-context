import { select, text, log } from '@clack/prompts'
import { System } from '../System'
import { Config } from '../Config'

export const profile = async () => {
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

    console.log(system.profiles)

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
            const addName = (await text({
                message: 'Enter a name for the server',
            })) as string
            config.addServer(addName, {
                command: '',
                args: [],
                env: {},
                settings: {},
            })
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
            const removeName = (await select({
                message: 'Select a server to remove',
                options: config.listServers().map(([key]) => ({
                    value: key,
                    label: key,
                })),
            })) as string
            config.removeServer(removeName)
            break
    }

    await system.save()
}
