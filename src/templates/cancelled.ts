export default `* 🚨 {{ workflow }} workflow for [{{ repoFullName }}@{{ branchName }}]({{ repoUrl }}) was cancelled before it could complete *

\\- Run ID: {{ runId }}
\\- Status: Cancelled
\\- Actor: [{{ actor }}](https://github.com/{{actor}})

* [Click here to see the full workflow details]({{ repoUrl }}/actions/runs/{{ runId }}) *
`;
