import type { ProjectPageDocument } from '~/prismicio-types'

export async function usePrismicArchivedProjects() {
    const projects = useState<(ProjectPageDocument | null)[]>('archived_projects', () => [])

    if (!projects.value.length || projects.value.every(p => !p)) {
        const fetchResponse = await usePrismicFetchProjects({}, true)

        projects.value = fetchResponse.data.value?.results || []
    }

    return projects
}
