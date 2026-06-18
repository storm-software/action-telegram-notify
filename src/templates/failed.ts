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

export default `* 🚨 {{ workflow }} workflow for [{{ repoFullName }}@{{ branchName }}]({{ repoUrl }}) has failed *

\\- Run ID: {{ runId }}
\\- Status: Failed
\\- Actor: [{{ actor }}](https://github.com/{{actor}})

* [Click here to see the full workflow details]({{ repoUrl }}/actions/runs/{{ runId }}) *
`;
