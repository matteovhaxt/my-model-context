import { select } from "@clack/prompts";
import { Config } from "../Config";

export const load = async () => {
    const client = await select({
        message: "Which config would you like to modify?",
        options: [
            { value: "claude", label: "Claude Desktop" },
            { value: "cursor", label: "Cursor" },
        ],
    });

    const config = new Config(client as string, client as string);

    return config;
}