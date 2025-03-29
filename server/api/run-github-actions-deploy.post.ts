export default defineEventHandler((event) => {
    const { githubUserToken } = useRuntimeConfig(event)

    return $fetch('https://api.github.com/repos/timothejoubert/julie-guzal/dispatches', {
        method: 'post',
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `token ${githubUserToken}`,
        },
        body: {
            event_type: 'on_access_run_github_actions_deploy_route',
            client_payload: {
                unit: false,
                integration: true,
            },
        },
    })
})
