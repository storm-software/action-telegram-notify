export default `*{{ action }} workflow for [{{ repoFullName }}@{{ ref }}]({{ repoUrl }}) was cancelled before it could complete*

- Run ID: {{ runId }}
- Run Number: #{{ runNumber }}
- Workflow Status: Cancelled
- Workflow Event: {{ eventName }}
- Workflow Actor: [{{ actor }}](https://github.com/{{actor}})
- Job: {{ job }}
- Current Branch: {{ ref }}
- Current SHA: {{ sha }}
- Checks Report: [View details]({{ repoUrl }}/runs/{{ runId }})

*[Click here to see the full workflow details](https://github.com/{{ repoFullName }}/actions/runs/{{ runId }})*
`;
