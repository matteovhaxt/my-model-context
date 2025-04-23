import { log, spinner } from '@clack/prompts'
import { Client } from '../core/Client'
import { exec } from 'child_process'

export const restartClient = async (client: Client) => {
    const restart = await spinner()

    restart.start('Restarting')

    try {
        await exec(`killall ${client.process}`)
    } catch (error) {
        restart.stop('Failed to close client')
        return
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
        exec(`open -a ${client.process}`)
    } catch (error) {
        restart.stop('Failed to start client')
        return
    }

    restart.stop()

    log.success('Restarted')
}
