import type { ContentRelationshipField } from '@prismicio/types'
import type { PickPrismicDocument, PrismicDocumentType } from '~/types/api'
import type { ProjectPageDocument } from '~/prismicio-types'

export type PageComponentProps<Type extends PrismicDocumentType> = {
    document: PickPrismicDocument<Type>
}

export type PossibleProjectPageDocument = ProjectPageDocument | ContentRelationshipField<'project_page'>
