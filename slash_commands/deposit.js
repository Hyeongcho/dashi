const {SlashCommandBuilder} = require("@discordjs/builders")
const { MessageEmbed } = require("discord.js")

module.exports.data = new SlashCommandBuilder()
.setName("deposit")
.setDescription("Deposit Dashcoins into bank")
.addIntegerOption(option => option
    .setName("amount")
    .setDescription("The amount to deposit")
    .setRequired(true)
)

module.exports.run = async ({client, interaction, Economy}) => {
    const amount = interaction.options.getInteger("amount")

    let getUser = await Economy.findOne({where: {id: interaction.member.id}})

    if(!getUser) {
        getUser = await Economy.create({id: interaction.member.id, wallet: 0, bank: 0, debitcard: false, motorcycle: false, superbike: false, wife: false, bailbonds: false})
    }
    
    if(getUser.wallet < amount) return await interaction.editReply({
        content: "Insufficient wallet balance!"
    })
    .catch((err) => {
        return
    })

    const newsenderWallet = getUser.wallet - amount
    const newsenderBank = getUser.bank + amount

    await Economy.update({wallet: newsenderWallet, bank: newsenderBank}, {where: {id: interaction.member.id}})

    const embed = new MessageEmbed()
    .setTitle("💸 Coin deposit complete 💸")
    .setDescription(`**${amount}** Dashcoins:tm: deposited in your bank!`)
    .setColor("GREEN")
    .setThumbnail(interaction.member.user.avatarURL())

    await interaction.editReply({
        embeds: [embed]
    })
    .catch((err) => {
        return
    })
}