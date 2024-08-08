import { envs } from "../../config";
import fetch from 'node-fetch';


export class DiscordService {

    private readonly discordWebHookUrl: string = envs.DISCORD_URL;

    constructor() { }

    async notify(message: string) {
        const body = {
            content: message,
        };
        
        const response = await fetch(this.discordWebHookUrl, {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify(body),
        });
        
        if (!response.ok) {
            console.log("Error sending message to Discord");
            return false;
        };
        
        return true;

    };




}