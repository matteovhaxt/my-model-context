import { intro, log, outro, select } from '@clack/prompts'
import { exit } from 'process'
import { System } from './System'

export const main = async () => {
    intro('Welcome to My Model Context')

    const system = await System.load()

    // console.log(JSON.stringify(system, null, 2));

    const action = await select({
        message: 'What would you like to do?',
        options: [
            { value: 'add', label: 'Add' },
            { value: 'list', label: 'List' },
            { value: 'remove', label: 'Remove' },
        ],
    })

    switch (action) {
        case 'add':
            system.addClient({
                name: 'test',
                config: {
                    test: {
                        command: 'test',
                        args: ['test'],
                    },
                },
            })
            break
        case 'list':
            log.info(system.clients.map((p) => p.name).join('\n'))
            break
        case 'remove':
            const client = await select({
                message: 'Select a client to remove',
                options: system.clients.map((p) => ({
                    value: p.name,
                    label: p.name,
                })),
            })
            system.removeClient(client as string)
            break
    }

    await system.save()

    outro('Thank you for using My Model Context')

    exit(0)
}
