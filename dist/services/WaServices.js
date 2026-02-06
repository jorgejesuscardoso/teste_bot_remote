"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const baileys_1 = __importStar(require("@whiskeysockets/baileys"));
const logger_1 = require("../utils/logger");
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const msgDefaults_1 = require("../utils/msg/msgDefaults");
class WhatsAppService {
    constructor() {
        this.ready = new Promise((resolve) => {
            this.resolveReady = resolve;
        });
    }
    async initialize(onMessage) {
        const { state, saveCreds } = await (0, baileys_1.useMultiFileAuthState)('auth');
        const { version } = await (0, baileys_1.fetchLatestBaileysVersion)();
        this.sock = (0, baileys_1.default)({
            auth: state,
            version,
            printQRInTerminal: true,
        });
        this.sock.ev.on('messages.upsert', async ({ messages }) => {
            if (!messages[0])
                return;
            onMessage(messages[0]);
        });
        this.sock.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
            if (qr) {
                qrcode_terminal_1.default.generate(qr, { small: true }); // ← exibe no terminal
            }
            if (connection === 'close') {
                const code = lastDisconnect?.error?.output?.statusCode;
                logger_1.logger.error(`Conexão encerrada: ${code}`);
                if (code !== baileys_1.DisconnectReason.loggedOut)
                    this.initialize(onMessage);
            }
            else if (connection === 'open') {
                logger_1.logger.success('Bot conectado ao WhatsApp!');
                this.resolveReady(); // <<< libera a promise
            }
        });
        this.sock.ev.on('creds.update', saveCreds);
        const sentWelcome = new Set(); // Armazena quem já recebeu boas-vindas
        this.sock.ev.on('group-participants.update', async (update) => {
            const { id, participants, action } = update;
            if (update.action !== 'add')
                return;
            const groupId = update.id;
            const metadata = await this.sock.groupMetadata(groupId);
            const groupName = metadata.subject;
            if (action === "add" && (id === "120363402452354299@g.us" || id === "120363392431154795@g.us")) {
                for (const participant of participants) {
                    if (sentWelcome.has(participant)) {
                        console.log(`Já enviou boas-vindas para @${participant.split("@")[0]}`);
                        continue; // Se já enviou, pula este usuário
                    }
                    try {
                        await new Promise((resolve) => setTimeout(resolve, 2000)); // Evita spam de mensagens
                        await this.sock.sendMessage(groupId, {
                            text: (0, msgDefaults_1.welcome)(participant.split("@")[0]),
                            mentions: [participant],
                        });
                        sentWelcome.add(participant); // Marca como já enviado
                    }
                    catch (error) {
                        console.error(`Erro ao enviar boas-vindas para ${participant}:`, error);
                    }
                }
            }
        });
    }
    async waitUntilReady() {
        await this.ready;
    }
    async getGroupAdmins(jid) {
        if (!this.sock)
            throw new Error('Socket não está inicializado ainda.');
        const metadata = await this.sock.groupMetadata(jid);
        const admins = metadata.participants
            .filter(p => p.admin)
            .map(p => p.id);
        return admins;
    }
    async sendMessage(jid, message, p0) {
        if (!this.sock)
            throw new Error('Socket não inicializado');
        return this.sock.sendMessage(jid, message);
    }
    async getGroupParticipants(jid) {
        if (!this.sock)
            throw new Error('Socket não inicializado');
        const metadata = await this.sock.groupMetadata(jid);
        return metadata.participants.map(p => p.id);
    }
    getSocket() {
        return this.sock;
    }
}
exports.WhatsAppService = WhatsAppService;
