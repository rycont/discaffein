import { Message, MessageEmbed, TextChannel } from "discord.js"
import { FriendListStruct } from "node-kakao"
import { ensureCategory, ensureChannel, getMainGuild } from "../bridge/channelMapper"
import config from "../storages/config"
import { chatWithDelay, sendEmbed } from "../utils/chat"

let operationChannel: TextChannel
const OPERATION_CHANNEL_NAME = 'operation🎡'

export const setOperationChannel = (_channel: TextChannel) => {
    // console.log(_channel)
    operationChannel = _channel
}
export const getOperationChannel = async () => {
    return await ensureChannel(OPERATION_CHANNEL_NAME, {
        parent: await ensureCategory(config.OPERATION_CATEGORY_NAME),
        type: 'text'
    }) as TextChannel
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
    await chatWithDelay('@을 눌러서 초대할 친구를 언급해주세요.')
    chatWithDelay('초대할 친구의 번호를 입력해주세요. 띄어쓰기로 구분해주세요.')
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
        sendNotice("채널 삭제가 완료됐습니다.")
    }
}

export default manager