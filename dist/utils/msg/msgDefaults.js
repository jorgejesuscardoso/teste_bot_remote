"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.welcome = void 0;
const avisoLink = "https://chat.whatsapp.com/EZDGGZufuMQDvtRzSVjaIv";
const welcome = (participant) => {
    return (`🌟✨ **Seja muito bem-vindo, @${participant.split("@")[0]}!** ✨🌟\n\n` +
        `📖 Aqui você pode falar um pouco sobre sua obra e compartilhar suas ideias! 🎨📜\n\n` +
        `⚠️ **Regras importantes para uma boa convivência:** ⚠️\n\n` +
        `🚫 *Sem links no chat!* ❌\n\n` +
        `🤝 **Respeite os coleguinhas** – Tratamos todos com educação, cordialidade e respeito! ❤️\n\n` +
        `📩 **Não chame ninguém no PV sem permissão** – Evite desconfortos! 🚷\n\n` +
        `⛔ **Sem tópicos religiosos ou políticos**✨\n\n` +
        `🔞 **Sem conteúdo 18+** – Mantenha o grupo seguro para todos! 🚨\n\n` +
        `📢 **Entre no nosso grupo de avisos e não saia sem avisar um ADM!** 🛑\n\n` +
        `Caso saia sem permissão, não poderá retornar ao projeto. 🚷\n\n\n` +
        `📌 **Grupo de Avisos | PROJETO LUNAR 🌙**\n\n` +
        `🔗 ${avisoLink} 🚀✨`);
};
exports.welcome = welcome;
