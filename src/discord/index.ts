import { Message } from "discord.js";
export { default as discord } from "../storages/discord";
export const listenQueue: Listener[] = []

type Listener = (chat: Message) => void

export const waitForDiscordChat = (): Promise<Message> => new Promise((res, rej) => {
    listenQueue.push((message) => res(message))
})