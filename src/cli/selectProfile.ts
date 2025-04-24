import { System } from '../core/System'
import { select, isCancel, log } from '@clack/prompts'

export const selectProfile = async () => {
    const system = await System.load()

    const profiles = Object.entries(system.profiles)

    if (profiles.length === 0) {
        log.warn('No profiles found')
        return
    }

    const selected = await select({
        message: 'Select a profile',
        options: profiles.map(([key]) => ({
            value: key,
            label: key,
        })),
    })

    const profile = profiles.find(([key]) => key === selected)
    if (!profile) {
        log.error('Profile not found')
        return
    }

    const [_, config] = profile

    return config
}
