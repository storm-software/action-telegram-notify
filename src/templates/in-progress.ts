export default `*{{ action }} workflow for [{{ repoFullName }}@{{ ref }}]({{ repoUrl }}) has started - {{ runId }}*

**> View the full workflow details

- Run ID: {{ runId }}
- Run Number: #{{ runNumber }}
- Workflow Status: In Progress
- Workflow Event: {{ eventName }}
- Workflow Actor: [{{ actor }}](https://github.com/{{actor}})
- Job: {{ job }}
- Current Branch: {{ ref }}
- Current SHA: {{ sha }}
- Checks Report: [View details]({{ repoUrl }}/runs/{{ runId }})

*[Click here to see the full workflow details](https://github.com/{{ repoFullName }}/actions/runs/{{ runId }})*
`;
