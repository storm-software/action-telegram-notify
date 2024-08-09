export default `* 🎉 {{ workflow }} workflow for [{{ repoFullName }}@{{ branchName }}]({{ repoUrl }}) has completed successfully *

\\- Run ID: {{ runId }}
\\- Status: Success
\\- Actor: [{{ actor }}](https://github.com/{{actor}})

* [Click here to see the full workflow details]({{ repoUrl }}/actions/runs/{{ runId }}) *
`;
