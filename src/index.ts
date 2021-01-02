import dotenv from "dotenv";
dotenv.config();
import { init as kakaoReceiver } from "./kakao"
import discordLogin from "./discord/login";
import kakaoLogin from "./kakao/login";

(async () => {
    await discordLogin()
    await kakaoLogin()
})()

kakaoReceiver()