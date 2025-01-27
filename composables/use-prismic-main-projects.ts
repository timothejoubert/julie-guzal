import type { ProjectPageDocument } from '~/prismicio-types'

export async function usePrismicMainProjects() {
    const projects = useState<(ProjectPageDocument | null)[]>('main_projects', () => [])

    if (!projects.value.filter(p => !!p).length) {
        const fetchResponse = await usePrismicFetchProjects()
        projects.value = fetchResponse.data.value?.results || []
    }

    return projects
}
