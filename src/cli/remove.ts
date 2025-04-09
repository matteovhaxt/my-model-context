import { select } from "@clack/prompts";
import { log } from "@clack/prompts";
import type { Config } from "../Config";    

export const remove = async (config: Config) => {
    const servers = config.listServers();
    const options = Object.entries(servers).map(([key]) => ({ value: key, label: key }));
    const server = await select({
        message: "Please select the server to remove.",
        options,
    });
    config.removeServer(server as string);
    log.success(`Successfully removed ${server as string} from the config`);
}