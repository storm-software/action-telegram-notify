import*as e from"@actions/core";import*as t from"@actions/github";import n from"axios";import*as r from"handlebars";var i=`* ⛔ {{ workflow }} workflow for [{{ repoFullName }}@{{ branchName }}]({{ repoUrl }}) was cancelled before it could complete *

\\- Run ID: {{ runId }}
\\- Status: Cancelled
\\- Actor: [{{ actor }}](https://github.com/{{actor}})

* [Click here to see the full workflow details]({{ repoUrl }}/actions/runs/{{ runId }}) *
`,a=`* 🚨 {{ workflow }} workflow for [{{ repoFullName }}@{{ branchName }}]({{ repoUrl }}) has failed *

\\- Run ID: {{ runId }}
\\- Status: Failed
\\- Actor: [{{ actor }}](https://github.com/{{actor}})

* [Click here to see the full workflow details]({{ repoUrl }}/actions/runs/{{ runId }}) *
`,o=`* 🤖 {{ workflow }} workflow for [{{ repoFullName }}@{{ branchName }}]({{ repoUrl }}) has started *

\\- Run ID: {{ runId }}
\\- Status: In Progress
\\- Actor: [{{ actor }}](https://github.com/{{actor}})

* [Click here to see the full workflow details]({{ repoUrl }}/actions/runs/{{ runId }}) *
`,s=`* 🎉 {{ workflow }} workflow for [{{ repoFullName }}@{{ branchName }}]({{ repoUrl }}) has completed successfully *

\\- Run ID: {{ runId }}
\\- Status: Success
\\- Actor: [{{ actor }}](https://github.com/{{actor}})

* [Click here to see the full workflow details]({{ repoUrl }}/actions/runs/{{ runId }}) *
`;(async()=>{try{let c=e.getInput(`chat`)||process.env.TELEGRAM_CHAT,l=e.getInput(`token`)||process.env.TELEGRAM_TOKEN,u=e.getInput(`status`);c||(e.setFailed("Please add the `TELEGRAM_CHAT` env variable or include the `chat` input parameter when calling this action"),process.exit(1)),l||(e.setFailed("Please add the `TELEGRAM_TOKEN` env variable or include the `token` input parameter when calling this action"),process.exit(1));try{let e=`${t.context.repo.owner}/${t.context.repo.repo}`,d=`https://github.com/${e}`,f={...t.context,repoUrl:d,repoFullName:e,checkListUrl:`${d}/commit/${t.context.sha}/checks`,branchName:t.context.ref.replace(`refs/heads/`,``),timestamp:new Date().toISOString()},p;switch(u?.toLowerCase()?.trim?.()?.replace(/\s+/g,`-`)){case`success`:p=r.compile(s);break;case`failed`:case`failure`:p=r.compile(a);break;case`cancelled`:p=r.compile(i);break;default:p=r.compile(o);break}console.log(`Sending message to chat: -100${c}`),await n.post(`https://api.telegram.org/bot${l}/sendMessage`,{chat_id:Number.parseInt(`-100${c}`),text:p(Object.keys(f).filter(e=>e!==`repoUrl`).reduce((e,t)=>{if(typeof f[t]==`string`){let n=f[t].length,r=``;for(let e=0;e<n;e++){let n=f[t][e];n&&("_*[]()~`>#+-=|{}.!".includes(n)?r+=`\\${n}`:r+=n)}e[t]=r}return e},f)),parse_mode:`MarkdownV2`}),console.log(`Successfully sent Telegram message`)}catch(t){console.log(`Telegrams error:`,t),e.setFailed(`Telegram FAILED: ${t?.message??`No Error Message`} \n\nException: ${JSON.stringify(t?.isAxiosError&&typeof t.toJSON==`function`?t.toJSON():t)}`),process.exit(1)}}catch(t){e.setFailed(t)}})().catch(t=>{console.error(t),e.setFailed(t)});export{};