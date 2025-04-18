import { intro, outro, select } from '@clack/prompts'
import { exit } from 'process'
import { client } from './cli/client'
import { profile } from './cli/profile'

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
            await client()
            break
        case 'profile':
            await profile()
            break
    }

    outro('Thank you for using My Model Context')

    exit(0)
}
