// main.ts (ou onde você dá o start)
import { bot } from "./app"
import express from "express"
import { waService } from "./app"
import axios from "axios"
import { GROUPS } from "./groups"

async function bootstrap() {
  await bot.start()
  console.log("🤖 Bot Whats rodando!")

  // ⚡ só libera a API depois que o bot estiver pronto
  await waService.waitUntilReady()

  const app = express()
  app.use(express.json())

  app.post("/sendCode", async (req, res) => {
    const { whatsappNumber, code } = req.body
    if (!whatsappNumber || !code) {
      return res.status(400).json({ error: "Parâmetros ausentes!" })
    }

    try {
      let numbersOnlyDigits = whatsappNumber.replace(/\D/g, "")

      //remover o 9 depois do ddd
      if (numbersOnlyDigits.length === 11 && numbersOnlyDigits[2] === '9') {
        numbersOnlyDigits = numbersOnlyDigits.slice(0, 2) + numbersOnlyDigits.slice(3)
      }

      const userJid = `55${numbersOnlyDigits}@s.whatsapp.net`

      const message = `
🔐 *Código de Verificação*

Aqui está o seu código: *${code}* ✅  

⚠️ *Atenção:* não compartilhe este código com ninguém.  
⏳ Ele será válido apenas pelos próximos *15 minutos*.  

Com carinho,
*Ming Yoongi - O mais lindo entre os lindos 🤖*
`


      await waService.sendMessage(userJid, { text: message }, {} as any)
      console.log(`✅ Enviado código ${code} para ${userJid}`)
      return res.json({ success: true })
    } catch (err) {
      console.error("❌ Erro ao enviar mensagem:", err)
      return res.status(500).json({ error: "Erro ao enviar mensagem no WhatsApp!" })
    }
  })

  app.post("/shop", async (req, res) => {
    const { data } = req.body
    const wtp = data.wtp
    const user = data.user

    if (!wtp || !user) {
      return res.status(400).json({ error: "Parâmetros ausentes!" })
    }

    try {
      let numbersOnlyDigits = wtp.replace(/\D/g, "")

      //remover o 9 depois do ddd
      if (numbersOnlyDigits.length === 11 && numbersOnlyDigits[2] === '9') {
        numbersOnlyDigits = numbersOnlyDigits.slice(0, 2) + numbersOnlyDigits.slice(3)
      }

      const userJid = `55${numbersOnlyDigits}@s.whatsapp.net`

      const { user, date, total_order, orders } = data
      const shopMessage = `
🛒 *Novo Pedido Recebido!*

👤 Comprador: *${user}*
📱 WhatsApp: ${wtp}
📅 Data: ${date}

📦 *Itens do pedido:*
${orders.map((o: any) => `- ${o.service} (x${o.qtd}) → ${o.total}`).join('\n')}

💰 *Total do pedido:* ${total_order}

✅ Por favor, entre em contato com o comprador para confirmar e prosseguir.
`


       // pega o grupo Bot Teste Lojinha Lunar
    const botTesteGroup = GROUPS.find(g => g.name === "Bot Teste")

      // pega o grupo Lojinha Lunar
    //const botTesteGroup = GROUPS.find(g => g.name === "Lojinha Lunar")

    if (!botTesteGroup) {
      throw new Error("Grupo Bot Teste não encontrado na lista GROUPS")
    }

    // manda no grupo Bot Teste
    await waService.sendMessage(botTesteGroup.id, { text: shopMessage }, {} as any)

    console.log(`✅ Pedido de ${user} enviado para grupo ${botTesteGroup.name}`)

    const userMessage = `
🛒 *Pedido Recebido com Sucesso!*

📅 *Data e hora:* ${date}

📦 *Itens do pedido:*
${orders.map((o: any) => `- ${o.service} (x${o.qtd}) → ${o.total}`).join('\n')}

💰 *Total:* ${total_order}

✅ Sua solicitação já foi registrada! Aguarde que nossa equipe entrará em contato para confirmar e finalizar o pedido.

🌙 *Projeto Lunar - Onde a lua ilumina os livros!*  
Estamos felizes em ter você como parte da nossa comunidade.
`


    await waService.sendMessage(userJid, { text: userMessage }, {} as any)
    console.log(`✅ Enviado confirmação para ${userJid}`)
    return res.status(200).json({ success: true })
    } catch (err) {
      console.error("❌ Erro ao enviar mensagem:", err)
      return res.status(500).json({ error: "Erro ao enviar mensagem no WhatsApp!" })
    }
  })

  app.listen(8000, () => console.log("🚀 Bot API rodando na porta 8000"))
}

bootstrap()

// manter servidor ativo
setInterval(async () => {
  console.log("🔄 Mantendo o servidor ativo...")
  try {
    const responde = await axios.get("https://map-v3.onrender.com/bot/status")
    console.log("✅ Resposta do servidor:", responde.data)
  } catch (error) {
    console.error("❌ Erro ao tentar manter o servidor ativo:", error)
  }
}, 12 * 60 * 1000) // a cada 12 minutos