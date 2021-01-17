import dotenv from "dotenv";
import { promises as fs } from "fs";
import yargs from "yargs"
dotenv.config();

import { listenInit } from "./bridge/init";
import discordLogin from "./discord/login";
import { clearChannels } from "./discord/manager";
import kakaoLogin, { initKakaoService } from "./kakao/login";

const {
    clearData
} = yargs(process.argv).argv as unknown as {
    clearData: boolean
};

(async () => {
    await discordLogin({
        clearData
    })
    if(clearData) {
        try {
            await fs.unlink('./bridgemap.db')
            await clearChannels()
            await initKakaoService()
        } catch(e) {
            console.log(e)
            console.error("연결DB 파일을 제거할 수 없었습니다.")
        }
    }
    await listenInit()
    await kakaoLogin(clearData)
})()

