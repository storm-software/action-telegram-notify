/* -------------------------------------------------------------------

       🗲 Storm Software - Action Telegram Notify

 This code was released as part of the Action Telegram Notify project. Action Telegram Notify
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/action-telegram-notify.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/action-telegram-notify
 Documentation:            https://docs.stormsoftware.com
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

/* eslint-disable no-console */

import core from "@actions/core";
import github from "@actions/github";
import handlebars from "handlebars";
import { request } from "undici";
import cancelledTemplate from "./templates/cancelled";
import failedTemplate from "./templates/failed";
import inprogressTemplate from "./templates/in-progress";
import successTemplate from "./templates/success";

// https://core.telegram.org/bots/api#markdownv2-style
// '_', '*', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'
const REQUIRE_ESCAPE = "_*[]()~`>#+-=|{}.!";

(async () => {
  try {
    const chat = core.getInput("chat") || process.env.TELEGRAM_CHAT;
    const token = core.getInput("token") || process.env.TELEGRAM_TOKEN;
    const status = core.getInput("status");

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

      let template!: handlebars.TemplateDelegate<typeof context>;
      switch (status?.toLowerCase()?.trim?.()?.replace(/\s+/g, "-")) {
        case "success":
          template = handlebars.compile<typeof context>(successTemplate);
          break;
        case "failed":
        case "failure":
          template = handlebars.compile<typeof context>(failedTemplate);
          break;
        case "cancelled":
          template = handlebars.compile<typeof context>(cancelledTemplate);
          break;
        default:
          template = handlebars.compile<typeof context>(inprogressTemplate);
          break;
      }

      console.log(`Sending message to chat: -100${chat}`);

      const response = await request(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify({
            chat_id: Number.parseInt(`-100${chat}`),
            text: template(
              Object.keys(context)
                .filter(key => key !== "repoUrl")
                .reduce((ret, key) => {
                  if (
                    typeof context[key as keyof typeof context] === "string"
                  ) {
                    const len = (context[key as keyof typeof context] as string)
                      .length;

                    let escaped = "";
                    for (let i = 0; i < len; i++) {
                      const char = (
                        context[key as keyof typeof context] as string
                      )[i];
                      if (char) {
                        if (REQUIRE_ESCAPE.includes(char)) {
                          escaped += `\\${char}`;
                        } else {
                          escaped += char;
                        }
                      }
                    }

                    (ret as Record<string, unknown>)[key] = escaped;
                  }

                  return ret;
                }, context)
            ),
            parse_mode: "MarkdownV2"
          })
        }
      );

      if (response.statusCode >= 400) {
        const body = await response.body.text();
        core.setFailed(
          `An error occured sending message to Telegram channel (${response.statusCode}): ${body}`
        );
      }

      console.log("Successfully sent Telegram message");
    } catch (error) {
      console.log("Telegrams error:", error);
      core.setFailed(
        `Telegram FAILED: ${(error as Error)?.message ?? "No Error Message"} \n\nException: ${JSON.stringify(
          error
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
