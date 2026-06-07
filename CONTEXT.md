# Public Reading Annotation

This context describes a public site for publishing reading notes alongside openly publishable source texts.

## Language

**Public Reading Annotation**:
A publishable reading page that presents a source text and the reader's notes together.
_Avoid_: Blog post, article

**Source Text**:
A public-domain, openly licensed, or otherwise authorized PDF or EPUB that may be shown on the site.
_Avoid_: Any book file, copyrighted book

**PDF Source Text**:
A source text whose page layout is fixed.
_Avoid_: Ebook when layout stability matters

**EPUB Source Text**:
A source text whose reading layout may reflow across devices and viewer settings.
_Avoid_: PDF, fixed-page source

**Reading Note**:
A curated note attached to a source text, passage, page, or reading session.
_Avoid_: Blog, raw highlight

**Source-Bound Note**:
A reading note that is only presented in relation to its source text.
_Avoid_: Standalone article

**Article Draft**:
A standalone prose draft derived from a source-text passage and a group of reading notes.
_Avoid_: Reading note, book overview

**WeChat Article Draft**:
An article draft intended to be manually polished and published through WeChat.
_Avoid_: Public reading annotation, website article

**Academic Article Style**:
A rigorous prose style that prioritizes concept precision, argument reconstruction, and textual evidence.
_Avoid_: Casual reading journal, popular explainer

**Lightweight Footnote**:
A brief article note used for translation, edition, terminology, or source-context clarification.
_Avoid_: Full reference system

**Article Archive**:
A repository area that stores article drafts derived from reading annotations.
_Avoid_: Public library, primary site navigation

**Article Source Passage**:
A larger passage of source text used as context for an article draft.
_Avoid_: Text anchor, single quote

**Note Group**:
A selected group of reading notes used together for an article draft.
_Avoid_: Single reading note, concept index

**Note Body**:
The Markdown content of a reading note.
_Avoid_: Rich text blob, plain comment

**Note Type**:
The interpretive role of a reading note.
_Avoid_: Category when meaning interpretive role

**Tag**:
A lightweight free-form label used to filter or group reading notes.
_Avoid_: Note type, concept

**Hashtag Tag**:
A tag captured from a maintainer-written hashtag in a local annotation note.
_Avoid_: Note type marker

**Explanation Note**:
A note that restates or clarifies a passage.
_Avoid_: Translation when not literally translating

**Question Note**:
A note that records an unresolved question about the source text.
_Avoid_: Comment

**Concept Note**:
A note that defines or develops a philosophical concept.
_Avoid_: Tag

**Concept Index**:
A book-level index generated from concept notes.
_Avoid_: Search results, tags list

**Concept Name**:
The first line of a concept note used as the concept index entry.
_Avoid_: Hashtag, note title

**Argument Note**:
A note that reconstructs the reasoning in a passage.
_Avoid_: Summary

**Connection Note**:
A note that relates the source text to another text, thinker, or problem.
_Avoid_: Random aside

**Text Anchor**:
A selected passage in a source text that a reading note primarily refers to.
_Avoid_: Highlight when meaning an anchor

**Source Excerpt**:
The wording captured from a text anchor for display alongside a reading note.
_Avoid_: Note body, citation when meaning anchor text

**Highlight Mark**:
A visual underline or highlight shown in the source text for a text anchor.
_Avoid_: Text anchor, reading note

**Semantic Highlight Color**:
A highlight color determined by the note type of the attached reading note.
_Avoid_: Decorative color, arbitrary color

**Annotation Color Mapping**:
A fixed mapping from local annotation colors to note types.
_Avoid_: Per-book color scheme, decorative palette

**Standalone Highlight**:
A highlight mark that is not attached to a reading note.
_Avoid_: Reading note, comment

**Note Stream**:
The visible sequence of reading notes shown beside or over the source text.
_Avoid_: Source text, highlight layer

**Location Anchor**:
A page, chapter, or structural position in a source text that a reading note secondarily refers to.
_Avoid_: Exact quote, selected text

**Free Note**:
A reading note that belongs to a source text but is not attached to a specific passage or location.
_Avoid_: Unattached blog post

**Maintainer**:
The repository owner who can add source texts, create anchors, write reading notes, and publish the static site through GitHub.
_Avoid_: Administrator when implying a website login

**Single-Maintainer Site**:
A site where exactly one maintainer can author content and all other visitors are readers.
_Avoid_: Community platform, multi-user editor

**Reader**:
A public visitor who can view published source texts and reading notes.
_Avoid_: Maintainer, editor

**Read-Only Reader**:
A reader who can view public source texts and reading notes but cannot comment, react, or create annotations.
_Avoid_: Community member, collaborator

**Authoring**:
The maintainer's local act of adding source texts, marking anchors, and writing notes before a repository update.
_Avoid_: Publishing when meaning editing

**Local Reading Tool**:
The maintainer's desktop reading environment for reading source texts and creating annotations before publication.
_Avoid_: Public site, website editor

**Captured Annotation**:
A local highlight, underline, or note created while reading before it is exported for publication.
_Avoid_: Published reading note

**Publication Export**:
The conversion of captured annotations into repository files used by the static site.
_Avoid_: Manual rewrite, website save

**Manual Export**:
A maintainer-initiated publication export command.
_Avoid_: Automatic sync, file watcher

**Publishing**:
Making a source text or reading note visible to readers through a GitHub Pages build.
_Avoid_: Local authoring, private saving

**Repository-Published Reading**:
A reading workflow where committed source texts and reading notes become public after the static site is built.
_Avoid_: Online authoring, database-backed saving

**Repository Update**:
A GitHub commit or push that changes the public reading annotation source files.
_Avoid_: Website save

**Public Library**:
The visible collection of source texts available from the site index.
_Avoid_: Private upload queue

**Source-Centered Reading**:
A publishing model where source texts are the primary public objects and notes are discovered through them.
_Avoid_: Article-centered blog

**Book Overview**:
A public page that summarizes one source text and organizes its reading notes, concepts, progress, and metadata.
_Avoid_: Reader page, homepage

**Book Metadata**:
The descriptive information for a source text, such as title, author, language, translator, edition, source, license, and summary.
_Avoid_: File properties

**Zotero Item Key**:
The stable Zotero identifier used to associate a local source text with a book package.
_Avoid_: Title matching, URL slug

**Book Slug**:
The human-readable identifier used in public URLs for a book package.
_Avoid_: Zotero item key

**Book Package**:
A repository folder containing one source text, its metadata, and its reading notes.
_Avoid_: Article folder, upload record

**Repository Source File**:
A source text file stored in the repository for public static-site access.
_Avoid_: External source link, private attachment

**Metadata Detection**:
An automated attempt to derive book metadata from an uploaded source text or external source.
_Avoid_: Manual cataloging

**Metadata Correction**:
The maintainer's act of editing detected book metadata before or after saving a source text.
_Avoid_: Automatic detection

**Publication Eligibility**:
The maintainer-confirmed basis that a source text may be publicly displayed.
_Avoid_: Detected license, assumed permission

**Reading Workspace**:
A page that displays the source text and reading notes side by side for close reading.
_Avoid_: Book overview, ordinary article

**PDF Reading Pane**:
A reading workspace pane that renders a PDF source text with its fixed-page layout.
_Avoid_: Extracted text view

**EPUB Reading Pane**:
A reading workspace pane that renders an EPUB source text as reflowable web reading content.
_Avoid_: PDF pane, fixed-page view

**Bidirectional Anchor Navigation**:
Navigation where selecting a reading note locates its source anchor and selecting a highlight mark locates its reading note.
_Avoid_: Synchronized scrolling

**Mobile Note Overlay**:
A mobile reading mode where notes open as an overlay above the source text.
_Avoid_: Split pane, desktop sidebar

**Reading Return Point**:
The source location or anchor a reader can return to after visiting an index or overview.
_Avoid_: Browser back when meaning reading context

**Full-Text Search**:
A search experience that covers book metadata, reading notes, and extracted source-text content.
_Avoid_: Metadata search, note-only search

**Search Result Anchor**:
The source location, text anchor, or reading note that a search result can open.
_Avoid_: Search snippet when meaning navigation target

**Note-First Search Result**:
A search result order that prefers matching reading notes before matching source text or book metadata.
_Avoid_: Source-first result order

## Relationships

- A **Public Reading Annotation** presents exactly one **Source Text**
- A **Source Text** has one **Book Overview**
- A **Source Text** has one **Book Metadata**
- A **Source Text** belongs to one **Book Package**
- A **Book Package** has one **Zotero Item Key**
- A **Book Package** has one **Book Slug**
- A **Book Package** contains one **Source Text**, one **Book Metadata** record, and one or more **Reading Notes**
- A **Source Text** may be stored as a **Repository Source File**
- A **Source Text** requires one **Publication Eligibility**
- **Metadata Detection** proposes **Book Metadata**
- A **Maintainer** may perform **Metadata Correction**
- A **Source Text** has one **Reading Workspace**
- A **PDF Source Text** appears in one **PDF Reading Pane**
- An **EPUB Source Text** appears in one **EPUB Reading Pane**
- A **Reading Workspace** supports **Bidirectional Anchor Navigation**
- A **Reading Workspace** uses a **Mobile Note Overlay** on small screens
- A **Concept Index** preserves a **Reading Return Point** when opened from a **Reading Workspace**
- **Full-Text Search** covers **Book Metadata**, **Reading Notes**, and **Source Text** content
- A **Full-Text Search** result may have one **Search Result Anchor**
- **Full-Text Search** uses **Note-First Search Result** ordering
- A **Source Text** is either a **PDF Source Text** or an **EPUB Source Text**
- A repository-published **Source Text** appears in the **Public Library**
- A **Public Reading Annotation** contains one or more **Reading Notes**
- A **Reading Note** belongs to exactly one **Source Text**
- Every **Reading Note** is a **Source-Bound Note**
- An **Article Draft** is derived from one **Article Source Passage** and one **Note Group**
- An **Article Draft** may belong to one **Article Archive**
- A **WeChat Article Draft** is an **Article Draft** written in **Academic Article Style**
- A **WeChat Article Draft** may use **Lightweight Footnotes**
- An **Article Archive** is not part of the **Public Library**
- A **Note Group** contains one or more **Reading Notes**
- A **Reading Note** has one **Note Body**
- A **Reading Note** has one **Note Type**
- A **Reading Note** may have zero or more **Tags**
- A **Hashtag Tag** may become one **Tag**
- A **Note Type** is one of **Explanation Note**, **Question Note**, **Concept Note**, **Argument Note**, or **Connection Note**
- A **Concept Note** may appear in one **Concept Index**
- A **Concept Note** has one **Concept Name**
- A **Reading Note** may have one **Text Anchor**, one **Location Anchor**, or neither
- A **Text Anchor** may store one **Source Excerpt**
- A **Text Anchor** may be displayed as one **Highlight Mark**
- A **Highlight Mark** may use a **Semantic Highlight Color**
- **Annotation Color Mapping** determines a **Note Type** from a captured annotation's color
- A **Highlight Mark** may exist as a **Standalone Highlight**
- A **Standalone Highlight** does not appear in the **Note Stream**
- A **Text Anchor** with a **Reading Note** is displayed as a **Highlight Mark** by default
- A **Free Note** belongs to one **Source Text**
- A **Maintainer** performs **Authoring**
- **Authoring** may create one or more **Captured Annotations** in a **Local Reading Tool**
- A **Publication Export** converts **Captured Annotations** into **Reading Notes** and **Highlight Marks**
- A **Manual Export** initiates a **Publication Export**
- A **Repository Update** results in **Publishing** after a successful GitHub Pages build
- A **Reader** views published **Public Reading Annotations**
- Every **Reader** is a **Read-Only Reader**
- A **Single-Maintainer Site** has exactly one **Maintainer** and any number of **Readers**

## Example dialogue

> **Dev:** "Can the **Maintainer** add any PDF as a **Source Text**?"
> **Domain expert:** "No — a **Source Text** must be public-domain, openly licensed, or otherwise authorized for public display before it is published."

## Flagged ambiguities

- "blog" was initially used to mean both a traditional article feed and a **Public Reading Annotation** — resolved: the core product is a public annotation page rather than a traditional blog post.
- "highlight" can mean either visual marking or the selected passage a note refers to — resolved: use **Text Anchor** for the semantic attachment, and reserve "highlight" for visual presentation.
- "article" was considered as a public presentation format for notes — resolved: first-version notes remain **Source-Bound Notes** rather than standalone articles.
- "article" later reappeared as a WeChat publishing format — resolved: use **Article Draft** for standalone prose derived from a source passage and a group of reading notes.
- "administrator" was initially used to mean an authenticated website user — resolved: in the static GitHub Pages version, the canonical term is **Maintainer**, and authorization happens through GitHub repository access.
