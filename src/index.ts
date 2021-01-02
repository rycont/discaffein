import dotenv from "dotenv";
dotenv.config();
import { init as kakaoReceiver } from "./kakao"
import './discord'
kakaoReceiver()