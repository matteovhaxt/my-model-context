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
        },
        cursor: {
            label: 'Cursor',
            jsonKey: 'mcpServers',
            path: join(homedir(), '.cursor', 'mcp.json'),
        },
        windsurf: {
            label: 'Windsurf',
            jsonKey: 'mcpServers',
            path: join(homedir(), '.codeium', 'windsurf', 'mcp_config.json'),
        },
    }

    const available = []

    for (const [key, client] of Object.entries(clients)) {
        if (await fileExists(client.path)) {
            available.push({
                name: key,
                label: client.label,
                path: client.path,
                jsonKey: client.jsonKey,
            })
        }
    }
    return available
}
