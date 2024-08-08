export default `*{{ job }} workflow for [{{ repoFullName }}@{{ branchName }}]({{ repoUrl }}) has completed successfully*

- Run ID: {{ runId }}
- Workflow Status: Success
- Workflow Actor: [{{ actor }}](https://github.com/{{actor}})

*[Click here to see the full workflow details](https://github.com/{{ repoFullName }}/actions/runs/{{ runId }})*
`;
