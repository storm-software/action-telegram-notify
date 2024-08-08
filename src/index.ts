import * as core from "@actions/core";
import * as github from "@actions/github";
import axios, { AxiosError } from "axios";
import * as Handlebars from "handlebars";
import cancelledTemplate from "./templates/cancelled";
import failedTemplate from "./templates/failed";
import inprogressTemplate from "./templates/in-progress";
import successTemplate from "./templates/success";

(async () => {
  try {
    let chat = core.getInput("chat") || process.env.TELEGRAM_CHAT;
    let token = core.getInput("token") || process.env.TELEGRAM_TOKEN;
    let status = core.getInput("status");

    if (!chat) {
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

    let response;
    try {
      response = await sendMessage(token, chat, status);

      console.log("Telegrams response:", response);
      core.setOutput("Telegrams SUCCESS", response);
    } catch (error) {
      console.log("Telegrams error:", error);
      core.setFailed(
        `Telegram FAILED: ${(error as AxiosError)?.message ?? "No Error Message"} \n\nException: ${JSON.stringify(
          (error as AxiosError)?.isAxiosError &&
            typeof (error as AxiosError).toJSON === "function"
            ? (error as AxiosError).toJSON()
            : error
        )}`
      );
      process.exit(1);
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
 * @param token - the Telegram bot token to send the message
 * @param chat - id of targeted channel or group, to which the message will be sent
 * @param status - status of the job
 * @returns the response from the Telegram API
 */
function sendMessage(token: string, chat: string, status: string) {
  const repoFullName = `${github.context.repo.owner}/${github.context.repo.repo}`;
  const repoUrl = `https://github.com/${repoFullName}`;
  const context = {
    ...github.context,
    repoUrl,
    repoFullName,
    checkListUrl: `${repoUrl}/commit/${github.context.sha}/checks`,
    timestamp: new Date().toISOString()
  };

  let template!: HandlebarsTemplateDelegate<typeof context>;
  switch (status?.toLowerCase()?.trim?.()?.replace(/\s+/g, "-")) {
    case "success":
      template = Handlebars.compile<typeof context>(successTemplate);
      break;
    case "failed":
      template = Handlebars.compile<typeof context>(failedTemplate);
      break;
    case "cancelled":
      template = Handlebars.compile<typeof context>(cancelledTemplate);
      break;
    default:
      template = Handlebars.compile<typeof context>(inprogressTemplate);
      break;
  }

  // console.log("Message to send to Telegram:", message);
  console.log(`Sending message to chat: -100${chat}`);

  return axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
    chat_id: `-100${chat}`,
    text: template(context),
    parse_mode: "MarkdownV2",
    reply_parameters: {
      quote: github.context.runId
    }
  });
}
