import { intro, isCancel, log, outro, select } from '@clack/prompts'
import { exit } from 'process'
import { clientMode } from './cli/clientMode'
import { profileMode } from './cli/profileMode'

export const main = async () => {
    intro('Welcome to My Model Context')

    const mode = await select({
        message: 'What do you want to edit?',
        options: [
            { value: 'client', label: 'Client' },
            { value: 'profile', label: 'Profile' },
        ],
    })

    switch (mode) {
        case 'client':
            await clientMode()
            break
        case 'profile':
            await profileMode()
            break
    }

    outro('Thank you for using My Model Context')

    exit(0)
}
