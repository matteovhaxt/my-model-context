import { isCancel, text, confirm } from '@clack/prompts'

export const addServer = async () => {
    const name = await text({
        message: 'Enter a name for the server',
    })

    const cmd = await text({
        message: 'Enter the start command',
    })

    let addEnv = await confirm({
        message: 'Add environment variables?',
    })

    const env: Record<string, string> = {}

    while (addEnv) {
        const key = await text({
            message: 'Enter a key',
        })
        const value = await text({
            message: 'Enter a value',
        })
        env[key as string] = value as string
        addEnv = await confirm({
            message: 'Add another environment variable?',
        })
    }

    let addSettings = await confirm({
        message: 'Add settings?',
    })

    const settings: Record<string, string> = {}

    while (addSettings) {
        const key = await text({
            message: 'Enter a key',
        })
        const value = await text({
            message: 'Enter a value',
        })
        settings[key as string] = value as string
        addSettings = await confirm({
            message: 'Add another setting?',
        })
    }

    const args = (cmd as string).split(' ')

    return {
        name: name as string,
        config: {
            command: args[0],
            args: args.slice(1),
            env,
            settings,
        },
    }
}
