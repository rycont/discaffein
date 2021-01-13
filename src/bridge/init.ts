import { Message } from "discord.js"
import { Chat } from "node-kakao"
import { discord, listenQueue } from "../discord"
import forwardToKakao from "../discord/forwardToKakao"
import manager, { getOperationChannel } from "../discord/manager"
import { kakao } from "../kakao"
import forwardToDiscord from "../kakao/forwardToDiscord"



export const listenInit = async () => {
    const operationChannel = await getOperationChannel()
    kakao.addListener('message', async (kakaoChat: Chat) => {
        forwardToDiscord(kakaoChat)
    })
    discord.on('message', async (discordChat) => {
        if(discordChat.author.id === discord.user?.id) return
        if(discordChat.channel.id === operationChannel.id) {
            if(listenQueue.length) return listenQueue.pop()?.(discordChat)
            return manager(discordChat)
        }
        forwardToKakao(discordChat)
    })
}

