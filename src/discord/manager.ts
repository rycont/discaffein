import { Message, MessageEmbed, TextChannel } from "discord.js"
import { FriendListStruct } from "node-kakao"
import { waitForDiscordChat } from "."
import { getMainGuild } from "../bridge/channelMapper"
import { kakao } from "../kakao"
import { promises as fs } from "fs";
import storage from "../storages/static"
import { chatWithDelay } from "../utils/chat"

export const getOperationChannel = async () => {
    const mainGuild = await getMainGuild()
    return (mainGuild.channels.cache.find(channel => channel.id === storage.operationChannelId) || mainGuild.channels.resolve(storage.operationChannelId)) as TextChannel
}

export const sendNotice = async (message: string) => {
    (await getOperationChannel()).send(new MessageEmbed({
        description: message,
        footer: {
            text: "DisCaffein"
        }
    }))
}

export const clearChannels = async () => {
    const { channels } = (await getMainGuild())
    const operationChannel = await getOperationChannel()
    channels.cache.filter(channel => channel.id !== operationChannel.id).map(async channel => {
        try {
            if (['text', 'category'].includes(channel.type))
                await channel.delete()
        } catch (e) {
            console.log(`Cannot delete channel ${channel.name}`)
        }
    })
}

const addCreatingGroupMemberLoop = async (cachedFriends?: FriendListStruct) => {
    await chatWithDelay('초대할 친구의 이름을 알려주세요.')
    const chat = await waitForDiscordChat()
    console.log(chat.content)
    console.log(await kakao.Service.searchFriends(chat.content))
}

const createNewChatChannel = async () => {
    await chatWithDelay('새 채팅방을 만듭니다')
    addCreatingGroupMemberLoop()
}

const manager = async (message: Message) => {
    const operation = message.content.split(' ')[0]
    if (operation === '새채팅방') {
        createNewChatChannel()
    }
    if (operation === '나가기') {
        // chatWithDelay('')
    }
    if (operation === 'cleardata') {
        sendNotice("채널을 모두 삭제합니다")
        await clearChannels()
        await fs.unlink('./bridgemap.db')
        sendNotice("채널 삭제가 완료됐습니다.")
    }
}

export default manager