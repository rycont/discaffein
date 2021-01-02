import login from "./login";

import * as KakaoTypes from "node-kakao";
import { kakao } from "./";
import forwardToDiscord from "./forwardToDiscord";

export { default as kakao } from "../storages/kakao";

export const init = () => {
    login();
    kakao.addListener('message', async (kakaoChat: KakaoTypes.Chat) => {
        forwardToDiscord(kakaoChat)
    })
}