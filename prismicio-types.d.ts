import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };


type PickContentRelationshipFieldData<
	TRelationship extends prismic.CustomTypeModelFetchCustomTypeLevel1 | prismic.CustomTypeModelFetchCustomTypeLevel2 | prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2,
	TData extends Record<string, prismic.AnyRegularField | prismic.GroupField | prismic.NestedGroupField | prismic.SliceZone>,
	TLang extends string
> = |
	// Content relationship fields
	{
		[TSubRelationship in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchContentRelationshipLevel1
		> as TSubRelationship["id"]]:
			ContentRelationshipFieldWithData<TSubRelationship["customtypes"], TLang>;
	} &
	// Group
	{
		[TGroup in Extract<
			TRelationship["fields"][number], prismic.CustomTypeModelFetchGroupLevel1 | prismic.CustomTypeModelFetchGroupLevel2
		> as TGroup["id"]]:
			TData[TGroup["id"]] extends prismic.GroupField<infer TGroupData>
				? prismic.GroupField<PickContentRelationshipFieldData<TGroup, TGroupData, TLang>>
				: never
	} &
	// Other fields
	{
		[TFieldKey in Extract<TRelationship["fields"][number], string>]:
			TFieldKey extends keyof TData ? TData[TFieldKey] : never;
	};

type ContentRelationshipFieldWithData<
	TCustomType extends readonly (prismic.CustomTypeModelFetchCustomTypeLevel1 | string)[] | readonly (prismic.CustomTypeModelFetchCustomTypeLevel2 | string)[],
	TLang extends string = string
> = {
	[ID in Exclude<TCustomType[number], string>["id"]]:
		prismic.ContentRelationshipField<
			ID,
			TLang,
			PickContentRelationshipFieldData<
				Extract<TCustomType[number], { id: ID }>,
				Extract<prismic.Content.AllDocumentTypes, { type: ID }>["data"],
				TLang
			>
		>
}[Exclude<TCustomType[number], string>["id"]];

/**
 * Item in *Contact → Columns*
 */
export interface ContactPageDocumentDataColumnsItem {
	/**
	 * Title field in *Contact → Columns*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact_page.columns[].title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Content field in *Contact → Columns*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact_page.columns[].content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
}

/**
 * Item in *Contact → Right column*
 */
export interface ContactPageDocumentDataRightColumnItem {
	/**
	 * image field in *Contact → Right column*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact_page.right_column[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Content field in *Contact → Right column*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact_page.right_column[].content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
}

type ContactPageDocumentDataSlicesSlice = never

/**
 * Content for Contact documents
 */
interface ContactPageDocumentData {
	/**
	 * Title field in *Contact*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact_page.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Titre mobile field in *Contact*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Version courte mobile
	 * - **API ID Path**: contact_page.title_mobile
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title_mobile: prismic.KeyTextField;
	
	/**
	 * Columns field in *Contact*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact_page.columns[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	columns: prismic.GroupField<Simplify<ContactPageDocumentDataColumnsItem>>;
	
	/**
	 * Credits field in *Contact*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact_page.credits
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	credits: prismic.RichTextField;
	
	/**
	 * Right column field in *Contact*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact_page.right_column[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	right_column: prismic.GroupField<Simplify<ContactPageDocumentDataRightColumnItem>>;
	
	/**
	 * Slice Zone field in *Contact*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact_page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ContactPageDocumentDataSlicesSlice>;/**
	 * Titre SEO field in *Contact*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Titre pour Google
	 * - **API ID Path**: contact_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Description SEO field in *Contact*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: ≈ 155 caractères
	 * - **API ID Path**: contact_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Image de partage field in *Contact*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: contact_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Contact document from Prismic
 *
 * - **API ID**: `contact_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ContactPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<ContactPageDocumentData>, "contact_page", Lang>;

type GalleryPageDocumentDataSlicesSlice = GalleryGridSlice | CrossNavSlice

/**
 * Content for Galerie documents
 */
interface GalleryPageDocumentData {
	/**
	 * Title field in *Galerie*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: gallery_page.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Slice Zone field in *Galerie*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: gallery_page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<GalleryPageDocumentDataSlicesSlice>;/**
	 * Titre SEO field in *Galerie*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Titre pour Google
	 * - **API ID Path**: gallery_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Description SEO field in *Galerie*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: ≈ 155 caractères
	 * - **API ID Path**: gallery_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Image de partage field in *Galerie*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: gallery_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Galerie document from Prismic
 *
 * - **API ID**: `gallery_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type GalleryPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<GalleryPageDocumentData>, "gallery_page", Lang>;

type HomePageDocumentDataSlicesSlice = ProjectFeedSlice | CrossNavSlice

/**
 * Content for Accueil documents
 */
interface HomePageDocumentData {
	/**
	 * Title field in *Accueil*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_page.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Slice Zone field in *Accueil*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<HomePageDocumentDataSlicesSlice>;/**
	 * Titre SEO field in *Accueil*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Titre pour Google
	 * - **API ID Path**: home_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Description SEO field in *Accueil*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: ≈ 155 caractères
	 * - **API ID Path**: home_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Image de partage field in *Accueil*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: home_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Accueil document from Prismic
 *
 * - **API ID**: `home_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomePageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<HomePageDocumentData>, "home_page", Lang>;

type LabPageDocumentDataSlicesSlice = CrossNavSlice | MasonryMediasSlice

/**
 * Content for Lab documents
 */
interface LabPageDocumentData {
	/**
	 * Title field in *Lab*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: lab_page.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Slice Zone field in *Lab*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: lab_page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<LabPageDocumentDataSlicesSlice>;/**
	 * Titre SEO field in *Lab*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Titre pour Google
	 * - **API ID Path**: lab_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Description SEO field in *Lab*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: ≈ 155 caractères
	 * - **API ID Path**: lab_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Image de partage field in *Lab*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: lab_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Lab document from Prismic
 *
 * - **API ID**: `lab_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type LabPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<LabPageDocumentData>, "lab_page", Lang>;

/**
 * Item in *Menu → links*
 */
export interface MenuDocumentDataLinksItem {
	/**
	 * Label field in *Menu → links*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: menu.links[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Internal page field in *Menu → links*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: menu.links[].internal_page
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	internal_page: prismic.ContentRelationshipField<"home_page"> | prismic.ContentRelationshipField<"lab_page"> | prismic.ContentRelationshipField<"gallery_page"> | prismic.ContentRelationshipField<"contact_page">;
	
	/**
	 * External url field in *Menu → links*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: menu.links[].external_url
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	external_url: prismic.KeyTextField;
}

/**
 * Content for Menu documents
 */
interface MenuDocumentData {
	/**
	 * Title field in *Menu*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: menu.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * links field in *Menu*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: menu.links[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	links: prismic.GroupField<Simplify<MenuDocumentDataLinksItem>>;
}

/**
 * Menu document from Prismic
 *
 * - **API ID**: `menu`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type MenuDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<MenuDocumentData>, "menu", Lang>;

type ProjectPageDocumentDataSlicesSlice = SimpleContentSlice | MediaSlice | CrossNavSlice

/**
 * Content for Projet documents
 */
interface ProjectPageDocumentData {
	/**
	 * Bouton retour field in *Projet*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: Selon le fond de la 1re image
	 * - **Default Value**: light
	 * - **API ID Path**: project_page.back_button_theme
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	back_button_theme: prismic.SelectField<"light" | "dark", "filled">;
	
	/**
	 * Titre field in *Projet*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_page.title
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Introduction field in *Projet*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_page.content
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
	
	/**
	 * Image de couverture field in *Projet*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_page.image
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Archivé field in *Projet*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: project_page.archived
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	archived: prismic.BooleanField;
	
	/**
	 * Date de tri field in *Projet*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: Tri de l'accueil, le plus récent en premier
	 * - **API ID Path**: project_page.order_date
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	order_date: prismic.DateField;
	
	/**
	 * Date du projet field in *Projet*
	 *
	 * - **Field Type**: Date
	 * - **Placeholder**: Année affichée
	 * - **API ID Path**: project_page.creation_date
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/date
	 */
	creation_date: prismic.DateField;
	
	/**
	 * Crédits field in *Projet*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_page.credits
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	credits: prismic.RichTextField;
	
	/**
	 * Lien externe field in *Projet*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: https://…
	 * - **API ID Path**: project_page.external_url
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	external_url: prismic.KeyTextField;
	
	/**
	 * Texte du lien field in *Projet*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: ex. Voir le site
	 * - **API ID Path**: project_page.external_url_label
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	external_url_label: prismic.KeyTextField;
	
	/**
	 * Slice Zone field in *Projet*
	 *
	 * - **Field Type**: Slice Zone
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_page.slices[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/slices
	 */
	slices: prismic.SliceZone<ProjectPageDocumentDataSlicesSlice>;/**
	 * Titre SEO field in *Projet*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Titre pour Google
	 * - **API ID Path**: project_page.meta_title
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_title: prismic.KeyTextField;
	
	/**
	 * Description SEO field in *Projet*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: ≈ 155 caractères
	 * - **API ID Path**: project_page.meta_description
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	meta_description: prismic.KeyTextField;
	
	/**
	 * Image de partage field in *Projet*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_page.meta_image
	 * - **Tab**: SEO & Metadata
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	meta_image: prismic.ImageField<never>;
}

/**
 * Projet document from Prismic
 *
 * - **API ID**: `project_page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ProjectPageDocument<Lang extends string = string> = prismic.PrismicDocumentWithUID<Simplify<ProjectPageDocumentData>, "project_page", Lang>;

/**
 * Item in *Réglages → Socials*
 */
export interface SettingsDocumentDataSocialsItem {
	/**
	 * Label field in *Réglages → Socials*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.socials[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * External url field in *Réglages → Socials*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.socials[].external_url
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	external_url: prismic.KeyTextField;
	
	/**
	 * Icon field in *Réglages → Socials*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.socials[].icon
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	icon: prismic.SelectField<"instagram" | "facebook" | "x" | "tiktok" | "vimeo" | "behance" | "youtube" | "linkedin">;
}

/**
 * Content for Réglages documents
 */
interface SettingsDocumentData {
	/**
	 * Site name field in *Réglages*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Mon site
	 * - **API ID Path**: settings.site_name
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	site_name: prismic.KeyTextField;
	
	/**
	 * Email field in *Réglages*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.email
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	email: prismic.KeyTextField;
	
	/**
	 * Socials field in *Réglages*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.socials[]
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	socials: prismic.GroupField<Simplify<SettingsDocumentDataSocialsItem>>;
	
	/**
	 * logo field in *Réglages*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.logo
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	logo: prismic.ImageField<never>;
	
	/**
	 * showreel field in *Réglages*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: *None*
	 * - **API ID Path**: settings.showreel
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	showreel: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * Description du site field in *Réglages*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: Description par défaut pour Google
	 * - **API ID Path**: settings.site_description
	 * - **Tab**: Main
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	site_description: prismic.KeyTextField;
}

/**
 * Réglages document from Prismic
 *
 * - **API ID**: `settings`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/content-modeling
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SettingsDocument<Lang extends string = string> = prismic.PrismicDocumentWithoutUID<Simplify<SettingsDocumentData>, "settings", Lang>;

export type AllDocumentTypes = ContactPageDocument | GalleryPageDocument | HomePageDocument | LabPageDocument | MenuDocument | ProjectPageDocument | SettingsDocument;

/**
 * Item in *Navigation → Default → Primary → Links*
 */
export interface CrossNavSliceDefaultPrimaryLinksItem {
	/**
	 * Label field in *Navigation → Default → Primary → Links*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cross_nav.default.primary.links[].label
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	label: prismic.KeyTextField;
	
	/**
	 * Internal page field in *Navigation → Default → Primary → Links*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cross_nav.default.primary.links[].internal_page
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	internal_page: prismic.ContentRelationshipField<"about_page"> | prismic.ContentRelationshipField<"home_page"> | prismic.ContentRelationshipField<"lab_page"> | prismic.ContentRelationshipField<"gallery_page">;
}

/**
 * Primary content in *Navigation → Default → Primary*
 */
export interface CrossNavSliceDefaultPrimary {
	/**
	 * Title field in *Navigation → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cross_nav.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Theme field in *Navigation → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: light
	 * - **API ID Path**: cross_nav.default.primary.theme
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	theme: prismic.SelectField<"light" | "dark", "filled">;
	
	/**
	 * Links field in *Navigation → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: cross_nav.default.primary.links[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	links: prismic.GroupField<Simplify<CrossNavSliceDefaultPrimaryLinksItem>>;
}

/**
 * Default variation for Navigation Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CrossNavSliceDefault = prismic.SharedSliceVariation<"default", Simplify<CrossNavSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Navigation*
 */
type CrossNavSliceVariation = CrossNavSliceDefault

/**
 * Navigation Shared Slice
 *
 * - **API ID**: `cross_nav`
 * - **Description**: CrossNav
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type CrossNavSlice = prismic.SharedSlice<"cross_nav", CrossNavSliceVariation>;

/**
 * Item in *Grille galerie → Default → Primary → Item*
 */
export interface GalleryGridSliceDefaultPrimaryItemItem {
	/**
	 * image field in *Grille galerie → Default → Primary → Item*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: gallery_grid.default.primary.item[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Description field in *Grille galerie → Default → Primary → Item*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: gallery_grid.default.primary.item[].description
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	description: prismic.RichTextField;
}

/**
 * Primary content in *Grille galerie → Default → Primary*
 */
export interface GalleryGridSliceDefaultPrimary {
	/**
	 * Item field in *Grille galerie → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: gallery_grid.default.primary.item[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	item: prismic.GroupField<Simplify<GalleryGridSliceDefaultPrimaryItemItem>>;
}

/**
 * Default variation for Grille galerie Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type GalleryGridSliceDefault = prismic.SharedSliceVariation<"default", Simplify<GalleryGridSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Grille galerie*
 */
type GalleryGridSliceVariation = GalleryGridSliceDefault

/**
 * Grille galerie Shared Slice
 *
 * - **API ID**: `gallery_grid`
 * - **Description**: GalleryGrid
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type GalleryGridSlice = prismic.SharedSlice<"gallery_grid", GalleryGridSliceVariation>;

/**
 * Item in *Mosaïque → Default → Primary → List*
 */
export interface MasonryMediasSliceDefaultPrimaryListItem {
	/**
	 * Image field in *Mosaïque → Default → Primary → List*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: masonry_medias.default.primary.list[].image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Embed field in *Mosaïque → Default → Primary → List*
	 *
	 * - **Field Type**: Embed
	 * - **Placeholder**: *None*
	 * - **API ID Path**: masonry_medias.default.primary.list[].embed
	 * - **Documentation**: https://prismic.io/docs/fields/embed
	 */
	embed: prismic.EmbedField
	
	/**
	 * Video autoplay field in *Mosaïque → Default → Primary → List*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: true
	 * - **API ID Path**: masonry_medias.default.primary.list[].video_autoplay
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	video_autoplay: prismic.BooleanField;
}

/**
 * Primary content in *Mosaïque → Default → Primary*
 */
export interface MasonryMediasSliceDefaultPrimary {
	/**
	 * List field in *Mosaïque → Default → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: masonry_medias.default.primary.list[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	list: prismic.GroupField<Simplify<MasonryMediasSliceDefaultPrimaryListItem>>;
}

/**
 * Default variation for Mosaïque Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MasonryMediasSliceDefault = prismic.SharedSliceVariation<"default", Simplify<MasonryMediasSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Mosaïque*
 */
type MasonryMediasSliceVariation = MasonryMediasSliceDefault

/**
 * Mosaïque Shared Slice
 *
 * - **API ID**: `masonry_medias`
 * - **Description**: MasonryMedias
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MasonryMediasSlice = prismic.SharedSlice<"masonry_medias", MasonryMediasSliceVariation>;

/**
 * Primary content in *Médias → Default → Primary*
 */
export interface MediaSliceDefaultPrimary {
	/**
	 * Spacing field in *Médias → Default → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: none
	 * - **API ID Path**: media.default.primary.spacing
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	spacing: prismic.SelectField<"none" | "xs" | "sm" | "md" | "lg", "filled">;
	
	/**
	 * Image field in *Médias → Default → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media.default.primary.image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	image: prismic.ImageField<never>;
	
	/**
	 * Embed field in *Médias → Default → Primary*
	 *
	 * - **Field Type**: Embed
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media.default.primary.embed
	 * - **Documentation**: https://prismic.io/docs/fields/embed
	 */
	embed: prismic.EmbedField
	
	/**
	 * video field in *Médias → Default → Primary*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media.default.primary.video
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	video: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * Video autoplay field in *Médias → Default → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: media.default.primary.video_autoplay
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	video_autoplay: prismic.BooleanField;
}

/**
 * Default variation for Médias Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MediaSliceDefault = prismic.SharedSliceVariation<"default", Simplify<MediaSliceDefaultPrimary>, never>;

/**
 * Primary content in *Médias → Deux médias → Primary*
 */
export interface MediaSliceDuoMediaPrimary {
	/**
	 * Spacing field in *Médias → Deux médias → Primary*
	 *
	 * - **Field Type**: Select
	 * - **Placeholder**: *None*
	 * - **Default Value**: none
	 * - **API ID Path**: media.duoMedia.primary.spacing
	 * - **Documentation**: https://prismic.io/docs/fields/select
	 */
	spacing: prismic.SelectField<"none" | "xs" | "sm" | "md" | "lg", "filled">;
	
	/**
	 * Main image field in *Médias → Deux médias → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media.duoMedia.primary.main_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	main_image: prismic.ImageField<never>;
	
	/**
	 * Main embed field in *Médias → Deux médias → Primary*
	 *
	 * - **Field Type**: Embed
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media.duoMedia.primary.main_embed
	 * - **Documentation**: https://prismic.io/docs/fields/embed
	 */
	main_embed: prismic.EmbedField
	
	/**
	 * Main video field in *Médias → Deux médias → Primary*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media.duoMedia.primary.main_video
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	main_video: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * Main video autoplay field in *Médias → Deux médias → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: media.duoMedia.primary.main_video_autoplay
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	main_video_autoplay: prismic.BooleanField;
	
	/**
	 * Secondary image field in *Médias → Deux médias → Primary*
	 *
	 * - **Field Type**: Image
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media.duoMedia.primary.secondary_image
	 * - **Documentation**: https://prismic.io/docs/fields/image
	 */
	secondary_image: prismic.ImageField<never>;
	
	/**
	 * Secondary embed field in *Médias → Deux médias → Primary*
	 *
	 * - **Field Type**: Embed
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media.duoMedia.primary.secondary_embed
	 * - **Documentation**: https://prismic.io/docs/fields/embed
	 */
	secondary_embed: prismic.EmbedField
	
	/**
	 * Secondary video field in *Médias → Deux médias → Primary*
	 *
	 * - **Field Type**: Link to Media
	 * - **Placeholder**: *None*
	 * - **API ID Path**: media.duoMedia.primary.secondary_video
	 * - **Documentation**: https://prismic.io/docs/fields/link-to-media
	 */
	secondary_video: prismic.LinkToMediaField<prismic.FieldState, never>;
	
	/**
	 * Secondary video autoplay field in *Médias → Deux médias → Primary*
	 *
	 * - **Field Type**: Boolean
	 * - **Placeholder**: *None*
	 * - **Default Value**: false
	 * - **API ID Path**: media.duoMedia.primary.secondary_video_autoplay
	 * - **Documentation**: https://prismic.io/docs/fields/boolean
	 */
	secondary_video_autoplay: prismic.BooleanField;
}

/**
 * Deux médias variation for Médias Slice
 *
 * - **API ID**: `duoMedia`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MediaSliceDuoMedia = prismic.SharedSliceVariation<"duoMedia", Simplify<MediaSliceDuoMediaPrimary>, never>;

/**
 * Slice variation for *Médias*
 */
type MediaSliceVariation = MediaSliceDefault | MediaSliceDuoMedia

/**
 * Médias Shared Slice
 *
 * - **API ID**: `media`
 * - **Description**: Media
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type MediaSlice = prismic.SharedSlice<"media", MediaSliceVariation>;

/**
 * Item in *Liste de projets → Choix manuel → Primary → Projets (archivés ignorés)*
 */
export interface ProjectFeedSliceManualChoicePrimaryProjectItem {
	/**
	 * Project document field in *Liste de projets → Choix manuel → Primary → Projets (archivés ignorés)*
	 *
	 * - **Field Type**: Content Relationship
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_feed.manualChoice.primary.project[].project_document
	 * - **Documentation**: https://prismic.io/docs/fields/content-relationship
	 */
	project_document: prismic.ContentRelationshipField<"project_page">;
}

/**
 * Default variation for Liste de projets Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProjectFeedSliceDefault = prismic.SharedSliceVariation<"default", Record<string, never>, never>;

/**
 * Primary content in *Liste de projets → Choix manuel → Primary*
 */
export interface ProjectFeedSliceManualChoicePrimary {
	/**
	 * Projets (archivés ignorés) field in *Liste de projets → Choix manuel → Primary*
	 *
	 * - **Field Type**: Group
	 * - **Placeholder**: *None*
	 * - **API ID Path**: project_feed.manualChoice.primary.project[]
	 * - **Documentation**: https://prismic.io/docs/fields/repeatable-group
	 */
	project: prismic.GroupField<Simplify<ProjectFeedSliceManualChoicePrimaryProjectItem>>;
}

/**
 * Choix manuel variation for Liste de projets Slice
 *
 * - **API ID**: `manualChoice`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProjectFeedSliceManualChoice = prismic.SharedSliceVariation<"manualChoice", Simplify<ProjectFeedSliceManualChoicePrimary>, never>;

/**
 * Slice variation for *Liste de projets*
 */
type ProjectFeedSliceVariation = ProjectFeedSliceDefault | ProjectFeedSliceManualChoice

/**
 * Liste de projets Shared Slice
 *
 * - **API ID**: `project_feed`
 * - **Description**: ProjectFeed
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type ProjectFeedSlice = prismic.SharedSlice<"project_feed", ProjectFeedSliceVariation>;

/**
 * Primary content in *Texte → Default → Primary*
 */
export interface SimpleContentSliceDefaultPrimary {
	/**
	 * Title field in *Texte → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: simple_content.default.primary.title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	title: prismic.KeyTextField;
	
	/**
	 * Secondary title field in *Texte → Default → Primary*
	 *
	 * - **Field Type**: Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: simple_content.default.primary.secondary_title
	 * - **Documentation**: https://prismic.io/docs/fields/text
	 */
	secondary_title: prismic.KeyTextField;
	
	/**
	 * Content field in *Texte → Default → Primary*
	 *
	 * - **Field Type**: Rich Text
	 * - **Placeholder**: *None*
	 * - **API ID Path**: simple_content.default.primary.content
	 * - **Documentation**: https://prismic.io/docs/fields/rich-text
	 */
	content: prismic.RichTextField;
}

/**
 * Default variation for Texte Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SimpleContentSliceDefault = prismic.SharedSliceVariation<"default", Simplify<SimpleContentSliceDefaultPrimary>, never>;

/**
 * Slice variation for *Texte*
 */
type SimpleContentSliceVariation = SimpleContentSliceDefault

/**
 * Texte Shared Slice
 *
 * - **API ID**: `simple_content`
 * - **Description**: SimpleContent
 * - **Documentation**: https://prismic.io/docs/slices
 */
export type SimpleContentSlice = prismic.SharedSlice<"simple_content", SimpleContentSliceVariation>;

declare module "@prismicio/client" {
	interface CreateClient {
		(repositoryNameOrEndpoint: string, options?: prismic.ClientConfig): prismic.Client<AllDocumentTypes>;
	}
	
	interface CreateWriteClient {
		(repositoryNameOrEndpoint: string, options: prismic.WriteClientConfig): prismic.WriteClient<AllDocumentTypes>;
	}
	
	interface CreateMigration {
		(): prismic.Migration<AllDocumentTypes>;
	}
	
	namespace Content {
		export type {
			ContactPageDocument,
			ContactPageDocumentData,
			ContactPageDocumentDataColumnsItem,
			ContactPageDocumentDataRightColumnItem,
			ContactPageDocumentDataSlicesSlice,
			GalleryPageDocument,
			GalleryPageDocumentData,
			GalleryPageDocumentDataSlicesSlice,
			HomePageDocument,
			HomePageDocumentData,
			HomePageDocumentDataSlicesSlice,
			LabPageDocument,
			LabPageDocumentData,
			LabPageDocumentDataSlicesSlice,
			MenuDocument,
			MenuDocumentData,
			MenuDocumentDataLinksItem,
			ProjectPageDocument,
			ProjectPageDocumentData,
			ProjectPageDocumentDataSlicesSlice,
			SettingsDocument,
			SettingsDocumentData,
			SettingsDocumentDataSocialsItem,
			AllDocumentTypes,
			CrossNavSlice,
			CrossNavSliceDefaultPrimaryLinksItem,
			CrossNavSliceDefaultPrimary,
			CrossNavSliceVariation,
			CrossNavSliceDefault,
			GalleryGridSlice,
			GalleryGridSliceDefaultPrimaryItemItem,
			GalleryGridSliceDefaultPrimary,
			GalleryGridSliceVariation,
			GalleryGridSliceDefault,
			MasonryMediasSlice,
			MasonryMediasSliceDefaultPrimaryListItem,
			MasonryMediasSliceDefaultPrimary,
			MasonryMediasSliceVariation,
			MasonryMediasSliceDefault,
			MediaSlice,
			MediaSliceDefaultPrimary,
			MediaSliceDuoMediaPrimary,
			MediaSliceVariation,
			MediaSliceDefault,
			MediaSliceDuoMedia,
			ProjectFeedSlice,
			ProjectFeedSliceManualChoicePrimaryProjectItem,
			ProjectFeedSliceManualChoicePrimary,
			ProjectFeedSliceVariation,
			ProjectFeedSliceDefault,
			ProjectFeedSliceManualChoice,
			SimpleContentSlice,
			SimpleContentSliceDefaultPrimary,
			SimpleContentSliceVariation,
			SimpleContentSliceDefault
		}
	}
}