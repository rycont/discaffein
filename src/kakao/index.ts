import requestVerifCode from "./requestVerifCode";
import loginWithVerifCode from "./loginWithVerifCode";
import login from "./login";

import * as KakaoTypes from "node-kakao";
import { ChatType } from "node-kakao";
import { ensureChannel } from "../discord";
import { KakaoAPI } from 'node-kakao/dist/kakao-api'
import { kakao } from "./";
import { MessageEmbed } from "discord.js";
// requestVerifCode();

export { default as kakao } from "../storages/kakao";

export const init = () => {
    login();
    kakao.addListener('message', async (kakaoChat: KakaoTypes.Chat) => {
        const kakaoSender = kakaoChat.Channel.getUserInfo(kakaoChat.Sender)
        if(!kakaoSender) throw new Error("알 수 없는 메시지")
        const discordChannel = await ensureChannel(kakaoChat.Channel.getDisplayName())
        
        discordChannel.send(new MessageEmbed({
          author: {
            name: kakaoSender.Nickname,
            iconURL: kakaoSender.FullProfileImageURL
          },
          description: kakaoChat.Text
        }))
        kakaoChat.AttachmentList.forEach((attach) => {
          if(attach.RequiredMessageType == ChatType.Sticker) {
            return discordChannel.send("", {
              files: [KakaoAPI.getEmoticonImageURL(attach.toJsonAttachment().path)]
            })
          }
          if(attach.RequiredMessageType == ChatType.Photo) {
            return discordChannel.send("", {
              files: [attach.toJsonAttachment().url]
            })
          }
        })
      })
}