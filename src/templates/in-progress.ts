export default `*{{ job }} workflow for [{{ repoFullName }}@{{ branchName }}]({{ repoUrl }}) has started*

- Run ID: {{ runId }}
- Workflow Status: In Progress
- Workflow Actor: [{{ actor }}](https://github.com/{{actor}})

*[Click here to see the full workflow details](https://github.com/{{ repoFullName }}/actions/runs/{{ runId }})*
`;
