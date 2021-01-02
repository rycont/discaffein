import { Message } from "discord.js";
import discord from "../storages/discord";
import forwardToKakao from "./forwardToKakao";
import { getOperationChannel } from "./manager";

type Listener = (chat: Message) => void

const listenQueue: Listener[] = []

export const waitForDiscordChat = (): Promise<Message> => new Promise((res, rej) => {
    listenQueue.push((message) => res(message))
})


discord.on('message', (discordChat) => {
    if(discordChat.author.id === discord.user?.id) return
    if(discordChat.channel.id === getOperationChannel().id) listenQueue.pop()?.(discordChat)
    forwardToKakao(discordChat)
})

export {
    discord
}