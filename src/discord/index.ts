import { Guild, TextChannel } from "discord.js";
import discord from "../storages/discord";
import forwardToKakao from "./forwardToKakao";
import login from "./login";

login();

let mainguild: Guild

export const getMainGuild = () => {
    if(mainguild) return mainguild

    const cachedGuilds = discord.guilds.cache
    const guild = cachedGuilds.get(cachedGuilds.keyArray()[0])
    if(!guild) throw new Error("봇이 어느 서버에도 소속되어있지 않습니다")
    mainguild = guild
    return mainguild
}

export const findChannelByName = (name: string) => {
    return getMainGuild().channels.cache.find((channel) => channel.name === name)
}

export const ensureChannel = async (name: string) => {
    const exist = findChannelByName(name) as TextChannel
    if(exist) return exist
    
    const newChannel = await getMainGuild().channels.create(name)
    return newChannel
}

discord.on('message', (discordChat) => {
    if(discordChat.author.id === discord.user?.id) return
    forwardToKakao(discordChat)
})

export {
    discord
}