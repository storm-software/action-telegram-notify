export default `* 🚀 {{ workflow }} workflow for [{{ repoFullName }}@{{ branchName }}]({{ repoUrl }}) has started *

\\- Run ID: {{ runId }}
\\- Status: In Progress
\\- Actor: [{{ actor }}](https://github.com/{{actor}})

* [Click here to see the full workflow details]({{ repoUrl }}/actions/runs/{{ runId }}) *
`;
