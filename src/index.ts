import * as core from "@actions/core";
import * as github from "@actions/github";
import * as http from "@actions/http-client";
import * as fs from "fs/promises";
import * as Handlebars from "handlebars";
import { encode } from "querystring";

const HTTP_CLIENT = new http.HttpClient();

(async () => {
  try {
    let chatId = core.getInput("chat") || process.env.TELEGRAM_CHAT;
    let token = core.getInput("token") || process.env.TELEGRAM_TOKEN;

    if (!chatId) {
      core.setFailed(
        "Please add the `TELEGRAM_CHAT` env variable or include the `chat` input parameter when calling this action"
      );
      process.exit(1);
    }
    if (!token) {
      core.setFailed(
        "Please add the `TELEGRAM_TOKEN` env variable or include the `token` input parameter when calling this action"
      );
      process.exit(1);
    }

    // let response = await HTTP_CLIENT.get(contentUrl);
    // let message = encodeURI(await response.readBody());

    // const { repo, ref, sha, workflow, actor } = github.context;

    // let icon: String;
    // switch (status) {
    //   case "success":
    //     icon = "✅";
    //     break;
    //   case "failure":
    //     icon = "❌";
    //     break;
    //   default:
    //     icon = "⚠️";
    //     break;
    // }
    // const uri = `https://api.telegram.org/bot${token}/sendMessage`;

    // const context = ;

    // const text = `${icon} [${repoFullname}](${repoUrl}/actions) ${workflow} *${jobStatus}*

    // \`${ref}\` \`${sha.substr(0, 7)}\` by *${actor}*

    // [View details]()`;

    // return request.post(uri, {
    //   body: {
    //     text,
    //     chat_id: chatId,
    //     parse_mode: "Markdown"
    //   },
    //   json: true
    // });

    // const telegramMessage = await telegramResponse.readBody();

    // - name: Send Telegram notification - Deployment successful
    // run: |
    //   notification_text=

    const response = await sendMessage(token, chatId, "success");

    console.log("Telegrams response:", response);
    if (response.message.statusCode != 200) {
      core.setFailed(`Telegram FAILED: ${JSON.stringify(response.message)}`);
    } else {
      core.setOutput("Telegrams SUCCESS", response);
    }

    return response;
  } catch (error) {
    core.setFailed(error as Error);
  }
})().catch(err => {
  console.error(err);
  core.setFailed(err);
});

/**
 * Send a Telegram message.
 *
 * @param token the Telegram bot token to send the message
 * @param chatId id of targeted channel or group, to which the message will be sent
 * @param status status of the job
 */
async function sendMessage(token: string, chatId: string, status?: string) {
  const repoFullName = `${github.context.repo.owner}/${github.context.repo.repo}`;
  const repoUrl = `https://github.com/${repoFullName}`;

  let template;
  switch (status?.toLowerCase()?.trim?.()?.replace(/\s+/g, "-")) {
    case "success":
      template = Handlebars.precompile(
        await fs.readFile("../templates/success.hbs", "utf8")
      );
      break;
    case "failed":
      template = Handlebars.precompile(
        await fs.readFile("../templates/failed.hbs", "utf8")
      );
      break;
    case "cancelled":
      template = Handlebars.precompile(
        await fs.readFile("../templates/cancelled.hbs", "utf8")
      );
      break;
    default:
      template = Handlebars.precompile(
        await fs.readFile("../templates/in-progress.hbs", "utf8")
      );
      break;
  }

  // console.log("Message to send to Telegram:", message);
  console.log(`Sending message to chat: -100${chatId}`);

  return await HTTP_CLIENT.post(
    `https://api.telegram.org/bot${token}/sendMessage?chat_id=-100${chatId}&text=${encodeURI(
      template({
        ...github.context,
        repoUrl,
        repoFullName,
        checkListUrl: `${repoUrl}/commit/${github.context.sha}/checks`,
        timestamp: new Date().toISOString()
      })
    )}&parse_mode=MarkdownV2&reply_parameters=${encode({
      quote: github.context.runId
    })}`,
    JSON.stringify({})
  );
}
