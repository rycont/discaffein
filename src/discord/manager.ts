import { Message, MessageEmbed, TextChannel } from "discord.js"
import { FriendListStruct } from "node-kakao"
import { waitForDiscordChat } from "."
import { kakao } from "../kakao"
import { chatWithDelay, sendEmbed } from "../utils/chat"

let operationChannel: TextChannel

export const setOperationChannel = (_channel: TextChannel) => operationChannel = _channel
export const getOperationChannel = () => operationChannel

export const sendNotice = async (message: string) => {
    getOperationChannel().send(new MessageEmbed({
        description: message,
        footer: {
            text: "DisCaffein"
        }
    }))
}

const addCreatingGroupMemberLoop = async (cachedFriends?: FriendListStruct) => {
    await chatWithDelay('@을 눌러서 초대할 친구를 언급해주세요.')
    // const name = (await waitForDiscordChat()).mentions.roles.

    // const { friends } = cachedFriends || await kakao.Service.requestFriendList()
    
    // await sendEmbed(false, ...friends
    //     .filter(friend => friend.friendNickName.includes(name) || friend.nickName.includes(name))
    //     .map((friend, index) => new MessageEmbed(({
    //         author: {
    //             iconURL: friend.originalProfileImageUrl,
    //             name: `${index + 1}) ${friend.friendNickName || friend.nickName}`,
    //         },
    //         description: friend.statusMessage
    //     }))))

    chatWithDelay('초대할 친구의 번호를 입력해주세요. 띄어쓰기로 구분해주세요.')
}

const createNewChatChannel = async () => {
    await chatWithDelay('새 채팅방을 만듭니다')
    addCreatingGroupMemberLoop()
}

const manager = (message: Message) => {
    const operation = message.content.split(' ')[0]
    if(operation === '새채팅방') {
        createNewChatChannel()
    }
    if(operation === '나가기') {
        // chatWithDelay('')
    }
}

export default manager