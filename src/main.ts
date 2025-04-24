import { intro, isCancel, log, outro, select } from '@clack/prompts'
import { exit } from 'process'
import { clientMode } from './cli/clientMode'
import { profileMode } from './cli/profileMode'
import chalk from 'chalk'

export const main = async () => {
    intro(
        `${chalk.bold.magenta('My Model Context')} - ${chalk.gray('Smooth management of local MCP configs')}`
    )

    while (true) {
        const mode = await select({
            message: 'What do you want to edit?',
            options: [
                { value: 'client', label: 'Client' },
                { value: 'profile', label: 'Profile' },
            ],
        })
        if (isCancel(mode)) {
            break
        }

        switch (mode) {
            case 'client':
                await clientMode()
                break
            case 'profile':
                await profileMode()
                break
        }
    }

    outro(`Thank you for using ${chalk.bold.magenta('My Model Context')}`)

    exit(0)
}
