import { nodes, state } from "membrane";

state.messages ??= [];

export async function run() {
  await generateSolarEclipseFact();

  const fact = state.messages[state.messages.length - 1];
  const message = `Good morning. There are ${getDaysUntilSolarEclipse()} days until the solar eclipse. ${fact}`;

  await nodes.sms.send({ message });
}

async function generateSolarEclipseFact() {
  const facts = state.messages.length
    ? state.messages.join("; ")
    : "(new audience, so any facts are fair game)";

  const result: any = await nodes.openai.models
    .one({ id: "gpt-4" })
    .completeChat({
      messages: [
        {
          role: "system",
          content: `You are an astronomy expert skilled at distilling information about space into understandable, fascinating facts for audiences of adults who don't know much about space. The solar eclipse is upcoming on April 8, 2024, and your audience today will be in Ohio to view the solar eclipse along the totality. Your job is to share a fact about solar eclipses. You don't need to preface the fact with any pleasantries or formatting, and please limit the fact to 3-5 sentences. Please also include a link from a reputable source (Wikipedia works) where the audience can learn more about the specific fact you shared. Please verify that the link is current and accessible as of today's date before sending it—your audience will be upset if the link doesn't work! For your reference, here's what the audience has already learned about solar eclipses so you can teach them new information: ${facts}`,
        },
      ],
    });

  state.messages.push(result.content);
}

function getDaysUntilSolarEclipse() {
  const today = new Date();
  const solarEclipse = new Date("2024-04-08");
  const msUntilSolarEclipse = solarEclipse.getTime() - today.getTime();
  return Math.ceil(msUntilSolarEclipse / (1000 * 60 * 60 * 24));
}
