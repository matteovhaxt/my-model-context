import { spinner } from '@clack/prompts'
import { spawn } from 'child_process'

export const restart = async (client: string) => {
    const loading = spinner()
    loading.start('Restarting')
    switch (client) {
        case 'claude':
            spawn('killall', ['Claude'])
            await new Promise((resolve) => setTimeout(resolve, 500))
            spawn('open', ['-a', 'Claude'])
            break
        case 'cursor':
            break
        default:
            throw new Error('Unsupported MCP client')
    }
    loading.stop('Success')
}
