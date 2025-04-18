import { access } from 'fs/promises'

export const fileExists = async (path: string) => {
    try {
        await access(path)
        return true
    } catch (error) {
        return false
    }
}
