import { access } from 'fs/promises'
import { homedir } from 'os'
import { join } from 'path'

export const fileExists = async (path: string) => {
    try {
        await access(path)
        return true
    } catch (error) {
        return false
    }
}

export const defaultClients = async () => {
    const clients = {
        claude: {
            label: 'Claude Desktop',
            jsonKey: 'mcpServers',
            path: join(
                homedir(),
                'Library',
                'Application Support',
                'Claude',
                'claude_desktop_config.json'
            ),
            process: 'Claude',
        },
        cursor: {
            label: 'Cursor',
            jsonKey: 'mcpServers',
            path: join(homedir(), '.cursor', 'mcp.json'),
            process: 'Cursor',
        },
        windsurf: {
            label: 'Windsurf',
            jsonKey: 'mcpServers',
            path: join(homedir(), '.codeium', 'windsurf', 'mcp_config.json'),
            process: 'Windsurf',
        },
    }

    const available = []

    for (const [key, client] of Object.entries(clients)) {
        if (await fileExists(client.path)) {
            available.push({
                ...client,
                name: key,
            })
        }
    }
    return available
}
