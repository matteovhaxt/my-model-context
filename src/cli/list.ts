import { log } from "@clack/prompts";
import type { Config } from "../Config";

export const list = (config: Config) => {
    const list = config.listServers();
    if (Object.keys(list).length === 0) {
        log.warn("No servers found");
    } else {
        log.info(Object.keys(list).join("\n"));
    }
}