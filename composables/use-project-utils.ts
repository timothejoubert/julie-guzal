import type { FilledContentRelationshipField } from '@prismicio/types'
import type { PossibleProjectPageDocument } from '~/types/app'
import { isContentRelationshipField, isPrismicDocument } from '~/utils/prismic/guard'
import type { ProjectPageDocument } from '~/prismicio-types'

export function useProjectUtils(project: PossibleProjectPageDocument | undefined | null) {
    const projectFilled = computed(() => {
        if (isContentRelationshipField(project)) return project as FilledContentRelationshipField<'project_page', string, ProjectPageDocument['data']>
        else if (isPrismicDocument(project)) return project // as ProjectPageDocument

        return undefined
    })

    const data = computed(() => projectFilled.value?.data)
    const tags = computed(() => projectFilled.value?.tags || [])

    const title = computed(() => data.value?.title)
    const image = computed(() => data.value?.image?.url && data.value.image)
    const date = computed(() => data.value?.creation_date)
    const content = computed(() => data.value?.content)
    const credits = computed(() => data.value?.credits)
    const externalUrl = computed(() => data.value?.external_url)
    const externalUrlLabel = computed(() => data.value?.external_url_label)

    return {
        image,
        title,
        date,
        tags,
        content,
        credits,
        externalUrl,
        externalUrlLabel,
    }
}
