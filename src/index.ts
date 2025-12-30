import * as core from "@actions/core";
import * as github from "@actions/github";
import axios, { AxiosError } from "axios";
import * as Handlebars from "handlebars";

import cancelledTemplate from "./templates/cancelled";
import failedTemplate from "./templates/failed";
import inprogressTemplate from "./templates/in-progress";
import successTemplate from "./templates/success";

// https://core.telegram.org/bots/api#markdownv2-style
// '_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'
const REQUIRE_ESCAPE = "_*[]()~`>#+-=|{}.!";

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

    try {
      const repoFullName = `${github.context.repo.owner}/${github.context.repo.repo}`;
      const repoUrl = `https://github.com/${repoFullName}`;
      const context = {
        ...github.context,
        repoUrl,
        repoFullName,
        checkListUrl: `${repoUrl}/commit/${github.context.sha}/checks`,
        branchName: github.context.ref.replace("refs/heads/", ""),
        timestamp: new Date().toISOString()
      };

      let template!: HandlebarsTemplateDelegate<typeof context>;
      switch (status?.toLowerCase()?.trim?.()?.replace(/\s+/g, "-")) {
        case "success":
          template = Handlebars.compile<typeof context>(successTemplate);
          break;
        case "failed":
        case "failure":
          template = Handlebars.compile<typeof context>(failedTemplate);
          break;
        case "cancelled":
          template = Handlebars.compile<typeof context>(cancelledTemplate);
          break;
        default:
          template = Handlebars.compile<typeof context>(inprogressTemplate);
          break;
      }

      console.log(`Sending message to chat: -100${chat}`);

      await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
        chat_id: Number.parseInt(`-100${chat}`),
        text: template(
          Object.keys(context)
            .filter(key => key !== "repoUrl")
            .reduce((ret, key) => {
              if (typeof context[key] === "string") {
                const len = context[key].length;

                let escaped = "";
                for (let i = 0; i < len; i++) {
                  const char = context[key][i];
                  if (REQUIRE_ESCAPE.indexOf(char) >= 0) {
                    escaped += "\\" + char;
                  } else {
                    escaped += char;
                  }
                }

                ret[key] = escaped;
              }

              return ret;
            }, context)
        ),
        parse_mode: "MarkdownV2"
      });

      console.log("Successfully sent Telegram message");
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
  } catch (error) {
    core.setFailed(error as Error);
  }
})().catch(err => {
  console.error(err);
  core.setFailed(err);
});
