#!/usr/bin/env zx
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

import { $, argv, chalk, echo } from "zx";

try {
  echo`${chalk.whiteBright(" 📋  Linting the repository...")}`;

  let filesList = "";
  if (argv._ && argv._.length > 0) {
    filesList = argv._.join(" ");
  }

  const eslintProc =
    $`pnpm exec eslint --fix --quiet --color --no-error-on-unmatched-pattern --config ./eslint.config.mjs --cache --cache-location ./node_modules/.cache/eslint/workspace.json --concurrency auto ${
      filesList || "**/*.{ts,tsx,js,jsx,json,md}"
    }`.timeout(`${30 * 60}s`);
  eslintProc.stdout.on("data", data => {
    echo`${data}`;
  });

  const actionUpRepoProc = $`pnpm exec storm-lint actions-up`.timeout(
    `${30 * 60}s`
  );
  actionUpRepoProc.stdout.on("data", data => {
    echo`${data}`;
  });

  const actionUpYamlProc =
    $`pnpm exec storm-lint actions-up --actions-up-path action.yml`.timeout(
      `${30 * 60}s`
    );
  actionUpYamlProc.stdout.on("data", data => {
    echo`${data}`;
  });

  const results = await Promise.all([
    eslintProc,
    actionUpRepoProc,
    actionUpYamlProc
  ]);
  if (results.some(result => result.exitCode !== 0)) {
    throw new Error(
      `An error occurred while linting the repository: \n\n${results.map(result => result.message).join("\n")}\n`
    );
  }

  echo`${chalk.green(" ✔ Successfully linted the repository's files")}`;
} catch (error) {
  echo`${chalk.red(error?.message ? error.message : "A failure occurred while linting the repository")}`;

  process.exit(1);
}
