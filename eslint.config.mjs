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

import { defineConfig } from "@storm-software/eslint";

Error.stackTraceLimit = Number.POSITIVE_INFINITY;

/** @type {import('eslint').Linter.Config[]} */
export default defineConfig({
  name: "action-telegram-notify",
  nx: false
});
