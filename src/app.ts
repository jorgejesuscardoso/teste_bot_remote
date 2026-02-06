import { WhatsAppService } from './services/WaServices'
import { Bot } from './core/Bot'
import { MsgTo } from './utils/msg/msgPersonality'
import { MsgAboutBullying } from './utils/msg/msgAboutBullying'
import { BehaviorList } from './utils/list/behavior'

export const waService = new WhatsAppService()
const msgTo = new MsgTo()
const msgAboutBullying = new MsgAboutBullying()
const behaviorList = BehaviorList

export const bot = new Bot(waService, msgTo, msgAboutBullying)

