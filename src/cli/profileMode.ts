import { select, text, log, isCancel } from '@clack/prompts'
import { System } from '../core/System'
import { Config } from '../core/Config'
import { addServer } from './addServer'

export const profileMode = async () => {
    const system = await System.load()

    while (true) {
        const name = await select({
            message: 'Select a profile',
            options: [
                ...Object.entries(system.profiles).map(([key]) => ({
                    value: key,
                    label: key,
                })),
                { value: 'new', label: 'New profile' },
            ],
        })

        if (isCancel(name)) {
            break
        }

        let profileName: string = name as string

        if (profileName === 'new') {
            const newName = await text({
                message: 'Enter a name for the new profile',
            })
            if (isCancel(newName)) {
                log.error('Cancelled profile creation')
                continue
            }
            profileName = newName as string
            system.profiles = {
                ...system.profiles,
                [profileName]: {},
            }
        }

        const profile = Object.entries(system.profiles).find(
            ([key]) => key === profileName
        )

        if (!profile) {
            log.error('Profile not found')
            break
        }

        const [_, entry] = profile
        const config = new Config(profileName, entry)

        while (true) {
            const action = await select({
                message: 'What do you want to do?',
                options: [
                    { value: 'add', label: 'Add a server' },
                    { value: 'list', label: 'List servers' },
                    { value: 'remove', label: 'Remove a server' },
                    { value: 'delete', label: 'Delete profile' },
                ],
            })

            if (isCancel(action)) {
                break
            }

            switch (action) {
                case 'add':
                    const server = await addServer()
                    if (!server) {
                        break
                    }
                    config.addServer(server)
                    break
                case 'list':
                    if (config.listServers().length === 0) {
                        log.warn('No servers found')
                        break
                    }
                    log.info(
                        config
                            .listServers()
                            .map(([key]) => key)
                            .join('\n')
                    )
                    break
                case 'remove':
                    const clients = config.listServers()
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
                        break
                    }
                    config.removeServer(removeName as string)
                    break
                case 'delete':
                    const { [profileName]: _, ...remainingProfiles } =
                        system.profiles
                    system.profiles = remainingProfiles
                    await system.save()
                    log.success('Deleted profile')
                    break
            }

            if (action === 'delete') {
                break
            }

            await system.save()
        }
    }
}
