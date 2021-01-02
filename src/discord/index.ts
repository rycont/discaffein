import discord from "../storages/discord";
import forwardToKakao from "./forwardToKakao";
import login from "./login";

login();

discord.on('message', (discordChat) => {
    if(discordChat.author.id === discord.user?.id) return
    forwardToKakao(discordChat)
})

export {
    discord
}