export default `*{{ job }} workflow for [{{ repoFullName }}@{{ branchName }}]({{ repoUrl }}) has failed*

- Run ID: {{ runId }}
- Workflow Status: Failed
- Workflow Actor: [{{ actor }}](https://github.com/{{actor}})

*[Click here to see the full workflow details](https://github.com/{{ repoFullName }}/actions/runs/{{ runId }})*
`;
