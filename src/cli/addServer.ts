import { isCancel, text, confirm } from '@clack/prompts'

export const addServer = async () => {
    const name = await text({
        message: 'Enter a name for the server',
    })
    if (isCancel(name)) {
        return
    }

    const cmd = await text({
        message: 'Enter the start command',
    })
    if (isCancel(cmd)) {
        return
    }

    let addEnv = await confirm({
        message: 'Add environment variables?',
    })
    if (isCancel(addEnv)) {
        return
    }

    const env: Record<string, string> = {}

    while (addEnv) {
        const key = await text({
            message: 'Enter a key',
        })
        if (isCancel(key)) {
            addEnv = false
            break
        }
        const value = await text({
            message: 'Enter a value',
        })
        if (isCancel(value)) {
            addEnv = false
            break
        }
        env[key as string] = value as string
        const continueAdd = await confirm({
            message: 'Add another environment variable?',
        })
        if (isCancel(continueAdd)) {
            addEnv = false
        } else {
            addEnv = continueAdd
        }
    }

    let addSettings = await confirm({
        message: 'Add settings?',
    })
    if (isCancel(addSettings)) {
        return
    }

    const settings: Record<string, string> = {}

    while (addSettings) {
        const key = await text({
            message: 'Enter a key',
        })
        if (isCancel(key)) {
            addSettings = false
            break
        }
        const value = await text({
            message: 'Enter a value',
        })
        if (isCancel(value)) {
            addSettings = false
            break
        }
        settings[key as string] = value as string
        const continueAdd = await confirm({
            message: 'Add another setting?',
        })
        if (isCancel(continueAdd)) {
            addSettings = false
        } else {
            addSettings = continueAdd
        }
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
