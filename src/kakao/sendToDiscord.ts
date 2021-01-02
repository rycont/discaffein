import { Chat, ChatType } from "node-kakao";
import { ensureChannel } from "../discord";
import { KakaoAPI } from 'node-kakao/dist/kakao-api'
import { MessageEmbed } from "discord.js";

const forwardToDiscord = async (kakaoChat: Chat) => {
    const kakaoSender = kakaoChat.Channel.getUserInfo(kakaoChat.Sender)!!
    const discordChannel = await ensureChannel(kakaoChat.Channel.getDisplayName())
    console.log(kakaoChat.Channel.getDisplayName())
    discordChannel.send(new MessageEmbed({
        author: {
            name: kakaoSender.Nickname,
            iconURL: kakaoSender.FullProfileImageURL
        },
        description: kakaoChat.Text
    }))
    if(kakaoChat.RawAttachment?.url) {
        discordChannel.send("아마도 음성메시지같습니다 :)", {
            files: [kakaoChat.RawAttachment.url]
        })
    }
    kakaoChat.AttachmentList.forEach((attach) => {
        console.log(attach.RequiredMessageType, attach.toJsonAttachment())
        if (attach.RequiredMessageType == ChatType.Sticker) {
            return discordChannel.send("", {
                files: [KakaoAPI.getEmoticonImageURL(attach.toJsonAttachment().path)]
            })
        }
        if (attach.RequiredMessageType == ChatType.Photo) {
            return discordChannel.send("", {
                files: [attach.toJsonAttachment().url]
            })
        }
    })
}

export default forwardToDiscord