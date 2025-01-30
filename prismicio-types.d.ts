// Code generated by Slice Machine. DO NOT EDIT.

import type * as prismic from "@prismicio/client";

type Simplify<T> = { [KeyType in keyof T]: T[KeyType] };

/**
 * Item in *Contact page → Columns*
 */
export interface ContactPageDocumentDataColumnsItem {
  /**
   * Title field in *Contact page → Columns*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: contact_page.columns[].title
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField;

  /**
   * Content field in *Contact page → Columns*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: contact_page.columns[].content
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  content: prismic.RichTextField;
}

/**
 * Item in *Contact page → Right column*
 */
export interface ContactPageDocumentDataRightColumnItem {
  /**
   * image field in *Contact page → Right column*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: contact_page.right_column[].image
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  image: prismic.ImageField<never>;

  /**
   * Content field in *Contact page → Right column*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: contact_page.right_column[].content
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  content: prismic.RichTextField;
}

type ContactPageDocumentDataSlicesSlice = never;

/**
 * Content for Contact page documents
 */
interface ContactPageDocumentData {
  /**
   * Title field in *Contact page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: contact_page.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField;

  /**
   * Title mobile field in *Contact page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: contact_page.title_mobile
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title_mobile: prismic.KeyTextField;

  /**
   * Color field in *Contact page*
   *
   * - **Field Type**: Color
   * - **Placeholder**: *None*
   * - **API ID Path**: contact_page.color
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#color
   */
  color: prismic.ColorField;

  /**
   * Columns field in *Contact page*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: contact_page.columns[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  columns: prismic.GroupField<Simplify<ContactPageDocumentDataColumnsItem>>;

  /**
   * Credits field in *Contact page*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: contact_page.credits
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  credits: prismic.RichTextField;

  /**
   * Right column field in *Contact page*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: contact_page.right_column[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  right_column: prismic.GroupField<
    Simplify<ContactPageDocumentDataRightColumnItem>
  >;

  /**
   * Slice Zone field in *Contact page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: contact_page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<ContactPageDocumentDataSlicesSlice> /**
   * Meta Title field in *Contact page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: contact_page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */;
  meta_title: prismic.KeyTextField;

  /**
   * Meta Description field in *Contact page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: contact_page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField;

  /**
   * Meta Image field in *Contact page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: contact_page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>;
}

/**
 * Contact page document from Prismic
 *
 * - **API ID**: `contact_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ContactPageDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithoutUID<
    Simplify<ContactPageDocumentData>,
    "contact_page",
    Lang
  >;

type GalleryPageDocumentDataSlicesSlice = CrossNavSlice | PhotographySlice;

/**
 * Content for Gallery Page documents
 */
interface GalleryPageDocumentData {
  /**
   * Title field in *Gallery Page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: gallery_page.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField;

  /**
   * Slice Zone field in *Gallery Page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: gallery_page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<GalleryPageDocumentDataSlicesSlice> /**
   * Meta Title field in *Gallery Page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: gallery_page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */;
  meta_title: prismic.KeyTextField;

  /**
   * Meta Description field in *Gallery Page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: gallery_page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField;

  /**
   * Meta Image field in *Gallery Page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: gallery_page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>;
}

/**
 * Gallery Page document from Prismic
 *
 * - **API ID**: `gallery_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type GalleryPageDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithoutUID<
    Simplify<GalleryPageDocumentData>,
    "gallery_page",
    Lang
  >;

type HomePageDocumentDataSlicesSlice = CrossNavSlice;

/**
 * Content for Home page documents
 */
interface HomePageDocumentData {
  /**
   * Title field in *Home page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: home_page.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField;

  /**
   * Slice Zone field in *Home page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: home_page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<HomePageDocumentDataSlicesSlice> /**
   * Meta Title field in *Home page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: home_page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */;
  meta_title: prismic.KeyTextField;

  /**
   * Meta Description field in *Home page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: home_page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField;

  /**
   * Meta Image field in *Home page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: home_page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>;
}

/**
 * Home page document from Prismic
 *
 * - **API ID**: `home_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type HomePageDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithoutUID<
    Simplify<HomePageDocumentData>,
    "home_page",
    Lang
  >;

type LabPageDocumentDataSlicesSlice = CrossNavSlice | MasonryMediasSlice;

/**
 * Content for Lab page documents
 */
interface LabPageDocumentData {
  /**
   * Title field in *Lab page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: lab_page.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField;

  /**
   * Slice Zone field in *Lab page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: lab_page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<LabPageDocumentDataSlicesSlice> /**
   * Meta Title field in *Lab page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: lab_page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */;
  meta_title: prismic.KeyTextField;

  /**
   * Meta Description field in *Lab page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: lab_page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField;

  /**
   * Meta Image field in *Lab page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: lab_page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never>;
}

/**
 * Lab page document from Prismic
 *
 * - **API ID**: `lab_page`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type LabPageDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithoutUID<
    Simplify<LabPageDocumentData>,
    "lab_page",
    Lang
  >;

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
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  label: prismic.KeyTextField;

  /**
   * Internal page field in *Menu → links*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: menu.links[].internal_page
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  internal_page: prismic.ContentRelationshipField<
    "home_page" | "lab_page" | "gallery_page" | "contact_page"
  >;

  /**
   * External url field in *Menu → links*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: menu.links[].external_url
   * - **Documentation**: https://prismic.io/docs/field#key-text
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
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField;

  /**
   * links field in *Menu*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: menu.links[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  links: prismic.GroupField<Simplify<MenuDocumentDataLinksItem>>;
}

/**
 * Menu document from Prismic
 *
 * - **API ID**: `menu`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type MenuDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithoutUID<Simplify<MenuDocumentData>, "menu", Lang>;

type ProjectPageDocumentDataSlicesSlice = CrossNavSlice;

type ProjectPageDocumentDataSlices2Slice = never;

/**
 * Content for Project page documents
 */
interface ProjectPageDocumentData {
  /**
   * Title field in *Project page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.title
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField;

  /**
   * Content field in *Project page*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.content
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  content: prismic.RichTextField;

  /**
   * Image field in *Project page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.image
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  image: prismic.ImageField<never>;

  /**
   * Archived field in *Project page*
   *
   * - **Field Type**: Boolean
   * - **Placeholder**: *None*
   * - **Default Value**: true
   * - **API ID Path**: project_page.archived
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#boolean
   */
  archived: prismic.BooleanField;

  /**
   * Creation date field in *Project page*
   *
   * - **Field Type**: Date
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.creation_date
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#date
   */
  creation_date: prismic.DateField;

  /**
   * External url field in *Project page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.external_url
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  external_url: prismic.KeyTextField;

  /**
   * Credits field in *Project page*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.credits
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  credits: prismic.RichTextField;

  /**
   * Slice Zone field in *Project page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.slices[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#slices
   */
  slices: prismic.SliceZone<ProjectPageDocumentDataSlicesSlice> /**
   * Meta Title field in *Project page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A title of the page used for social media and search engines
   * - **API ID Path**: project_page.meta_title
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */;
  meta_title: prismic.KeyTextField;

  /**
   * Meta Description field in *Project page*
   *
   * - **Field Type**: Text
   * - **Placeholder**: A brief summary of the page
   * - **API ID Path**: project_page.meta_description
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  meta_description: prismic.KeyTextField;

  /**
   * Meta Image field in *Project page*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.meta_image
   * - **Tab**: SEO & Metadata
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  meta_image: prismic.ImageField<never> /**
   * Slice Zone field in *Project page*
   *
   * - **Field Type**: Slice Zone
   * - **Placeholder**: *None*
   * - **API ID Path**: project_page.slices2[]
   * - **Tab**: Slices
   * - **Documentation**: https://prismic.io/docs/field#slices
   */;
  slices2: prismic.SliceZone<ProjectPageDocumentDataSlices2Slice>;
}

/**
 * Project page document from Prismic
 *
 * - **API ID**: `project_page`
 * - **Repeatable**: `true`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type ProjectPageDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithUID<
    Simplify<ProjectPageDocumentData>,
    "project_page",
    Lang
  >;

/**
 * Item in *settings → Socials*
 */
export interface SettingsDocumentDataSocialsItem {
  /**
   * Label field in *settings → Socials*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.socials[].label
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  label: prismic.KeyTextField;

  /**
   * External url field in *settings → Socials*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.socials[].external_url
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  external_url: prismic.KeyTextField;

  /**
   * Icon field in *settings → Socials*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.socials[].icon
   * - **Documentation**: https://prismic.io/docs/field#select
   */
  icon: prismic.SelectField<
    | "instagram"
    | "facebook"
    | "x"
    | "tiktok"
    | "vimeo"
    | "behance"
    | "youtube"
    | "linkedin"
  >;
}

/**
 * Content for settings documents
 */
interface SettingsDocumentData {
  /**
   * Site name field in *settings*
   *
   * - **Field Type**: Text
   * - **Placeholder**: Mon site
   * - **API ID Path**: settings.site_name
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  site_name: prismic.KeyTextField;

  /**
   * Email field in *settings*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.email
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  email: prismic.KeyTextField;

  /**
   * Socials field in *settings*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.socials[]
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  socials: prismic.GroupField<Simplify<SettingsDocumentDataSocialsItem>>;

  /**
   * logo field in *settings*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.logo
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  logo: prismic.ImageField<never>;

  /**
   * showreel field in *settings*
   *
   * - **Field Type**: Link to Media
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.showreel
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  showreel: prismic.LinkToMediaField;

  /**
   * Site description field in *settings*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: settings.site_description
   * - **Tab**: Main
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  site_description: prismic.KeyTextField;
}

/**
 * settings document from Prismic
 *
 * - **API ID**: `settings`
 * - **Repeatable**: `false`
 * - **Documentation**: https://prismic.io/docs/custom-types
 *
 * @typeParam Lang - Language API ID of the document.
 */
export type SettingsDocument<Lang extends string = string> =
  prismic.PrismicDocumentWithoutUID<
    Simplify<SettingsDocumentData>,
    "settings",
    Lang
  >;

export type AllDocumentTypes =
  | ContactPageDocument
  | GalleryPageDocument
  | HomePageDocument
  | LabPageDocument
  | MenuDocument
  | ProjectPageDocument
  | SettingsDocument;

/**
 * Item in *CrossNav → Default → Primary → Links*
 */
export interface CrossNavSliceDefaultPrimaryLinksItem {
  /**
   * Label field in *CrossNav → Default → Primary → Links*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: cross_nav.default.primary.links[].label
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  label: prismic.KeyTextField;

  /**
   * Internal page field in *CrossNav → Default → Primary → Links*
   *
   * - **Field Type**: Content Relationship
   * - **Placeholder**: *None*
   * - **API ID Path**: cross_nav.default.primary.links[].internal_page
   * - **Documentation**: https://prismic.io/docs/field#link-content-relationship
   */
  internal_page: prismic.ContentRelationshipField<
    "about_page" | "home_page" | "lab_page" | "gallery_page"
  >;
}

/**
 * Primary content in *CrossNav → Default → Primary*
 */
export interface CrossNavSliceDefaultPrimary {
  /**
   * Title field in *CrossNav → Default → Primary*
   *
   * - **Field Type**: Text
   * - **Placeholder**: *None*
   * - **API ID Path**: cross_nav.default.primary.title
   * - **Documentation**: https://prismic.io/docs/field#key-text
   */
  title: prismic.KeyTextField;

  /**
   * Theme field in *CrossNav → Default → Primary*
   *
   * - **Field Type**: Select
   * - **Placeholder**: *None*
   * - **Default Value**: light
   * - **API ID Path**: cross_nav.default.primary.theme
   * - **Documentation**: https://prismic.io/docs/field#select
   */
  theme: prismic.SelectField<"light" | "dark", "filled">;

  /**
   * Links field in *CrossNav → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: cross_nav.default.primary.links[]
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  links: prismic.GroupField<Simplify<CrossNavSliceDefaultPrimaryLinksItem>>;
}

/**
 * Default variation for CrossNav Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type CrossNavSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<CrossNavSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *CrossNav*
 */
type CrossNavSliceVariation = CrossNavSliceDefault;

/**
 * CrossNav Shared Slice
 *
 * - **API ID**: `cross_nav`
 * - **Description**: CrossNav
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type CrossNavSlice = prismic.SharedSlice<
  "cross_nav",
  CrossNavSliceVariation
>;

/**
 * Item in *MasonryMedias → Default → Primary → List*
 */
export interface MasonryMediasSliceDefaultPrimaryListItem {
  /**
   * Image field in *MasonryMedias → Default → Primary → List*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: masonry_medias.default.primary.list[].image
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  image: prismic.ImageField<never>;
}

/**
 * Primary content in *MasonryMedias → Default → Primary*
 */
export interface MasonryMediasSliceDefaultPrimary {
  /**
   * List field in *MasonryMedias → Default → Primary*
   *
   * - **Field Type**: Group
   * - **Placeholder**: *None*
   * - **API ID Path**: masonry_medias.default.primary.list[]
   * - **Documentation**: https://prismic.io/docs/field#group
   */
  list: prismic.GroupField<Simplify<MasonryMediasSliceDefaultPrimaryListItem>>;
}

/**
 * Default variation for MasonryMedias Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type MasonryMediasSliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<MasonryMediasSliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *MasonryMedias*
 */
type MasonryMediasSliceVariation = MasonryMediasSliceDefault;

/**
 * MasonryMedias Shared Slice
 *
 * - **API ID**: `masonry_medias`
 * - **Description**: MasonryMedias
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type MasonryMediasSlice = prismic.SharedSlice<
  "masonry_medias",
  MasonryMediasSliceVariation
>;

/**
 * Primary content in *Photography → Default → Primary*
 */
export interface PhotographySliceDefaultPrimary {
  /**
   * Image field in *Photography → Default → Primary*
   *
   * - **Field Type**: Image
   * - **Placeholder**: *None*
   * - **API ID Path**: photography.default.primary.image
   * - **Documentation**: https://prismic.io/docs/field#image
   */
  image: prismic.ImageField<never>;

  /**
   * Description field in *Photography → Default → Primary*
   *
   * - **Field Type**: Rich Text
   * - **Placeholder**: *None*
   * - **API ID Path**: photography.default.primary.description
   * - **Documentation**: https://prismic.io/docs/field#rich-text-title
   */
  description: prismic.RichTextField;
}

/**
 * Default variation for Photography Slice
 *
 * - **API ID**: `default`
 * - **Description**: Default
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type PhotographySliceDefault = prismic.SharedSliceVariation<
  "default",
  Simplify<PhotographySliceDefaultPrimary>,
  never
>;

/**
 * Slice variation for *Photography*
 */
type PhotographySliceVariation = PhotographySliceDefault;

/**
 * Photography Shared Slice
 *
 * - **API ID**: `photography`
 * - **Description**: Photography
 * - **Documentation**: https://prismic.io/docs/slice
 */
export type PhotographySlice = prismic.SharedSlice<
  "photography",
  PhotographySliceVariation
>;

declare module "@prismicio/client" {
  interface CreateClient {
    (
      repositoryNameOrEndpoint: string,
      options?: prismic.ClientConfig,
    ): prismic.Client<AllDocumentTypes>;
  }

  interface CreateWriteClient {
    (
      repositoryNameOrEndpoint: string,
      options: prismic.WriteClientConfig,
    ): prismic.WriteClient<AllDocumentTypes>;
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
      ProjectPageDocumentDataSlices2Slice,
      SettingsDocument,
      SettingsDocumentData,
      SettingsDocumentDataSocialsItem,
      AllDocumentTypes,
      CrossNavSlice,
      CrossNavSliceDefaultPrimaryLinksItem,
      CrossNavSliceDefaultPrimary,
      CrossNavSliceVariation,
      CrossNavSliceDefault,
      MasonryMediasSlice,
      MasonryMediasSliceDefaultPrimaryListItem,
      MasonryMediasSliceDefaultPrimary,
      MasonryMediasSliceVariation,
      MasonryMediasSliceDefault,
      PhotographySlice,
      PhotographySliceDefaultPrimary,
      PhotographySliceVariation,
      PhotographySliceDefault,
    };
  }
}
