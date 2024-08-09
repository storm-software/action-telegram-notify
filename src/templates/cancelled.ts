export default `* 🚨 {{ job }} workflow for [{{ repoFullName }}@{{ branchName }}]({{ repoUrl }}) was cancelled before it could complete *

 - Run ID: {{ runId }}
 - Workflow Status: Cancelled
 - Workflow Actor: [{{ actor }}](https://github.com/{{actor}})

* [Click here to see the full workflow details]({{ repoUrl }}/actions/runs/{{ runId }}) *
`;
