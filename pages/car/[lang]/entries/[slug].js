import ArticleChecker from '@components/live-blog/dynamicArticleChecker'

// import ArticleChecker from '@components/live-blog/articleChecker'

import { Helmet } from 'react-helmet'
import { callContentful } from '@utils/contentfulHelper'
import HeaderComponent from '@components/common/header'
import DynamicBlogContentComponent from '@components/live-blog/Components'
import HorizontalTimelineComponent from '@components/live-blog/timeline/horizontalTimeline'
import Sidebar from '@components/live-blog/sidebar'
import RichtextComponent from '@components/richText'
import ShareIcons from '@components/common/shareIcons'

const LiveBlogEntry = ({ liveBlogEntryCollection, liveBlogData, lang, liveBlogPages }) => {
	console.log(liveBlogEntryCollection.blogEntryContentCollection.items)

	const shareProps = {
		title: liveBlogEntryCollection.title || 'The New Humanitarian | Live from the CAR', // TODO
		url: `https://vercel.thenewhumanitarian.org/${process.env.NEXT_PUBLIC_CAR_BLOG_URL}/${lang}/entries/${liveBlogEntryCollection.slug}`, // TODO
		socialTitle: liveBlogEntryCollection.title || 'The New Humanitarian | Live from the CAR', // TODO
		socialDescription: 'Our journalism, impact, audience, and more.', // TODO
		socialImage: 'https://www.thenewhumanitarian.org/s3/files/styles/responsive_large_2x/public/annualreport.png?itok=Y0cc4R4Y', // TODO
		nodeId: null,
		updatedTime: liveBlogEntryCollection.date,
		modiefiedTime: liveBlogEntryCollection.date,
		publishedTime: liveBlogEntryCollection.date,
	}

	return (
		<div>
			<Helmet
				htmlAttributes={{
					lang: lang === 'en' ? 'en-GB' : 'fr-FR',
				}}
			>
				<meta name='viewport' content='width=device-width, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no' />
				{liveBlogEntryCollection.blogEntrySocialImage?.url && <meta property='og:image' content={liveBlogEntryCollection.blogEntrySocialImage.url} />}
			</Helmet>

			{/* Without shareProps so we don't show share buttons in the header */}
			<HeaderComponent lang={lang} />

			{/* Horizontal timeline show all the data, not only the paginated/filtered ones */}
			<div className={'relative w-full border-b px-0 py-5'} style={{ borderBottom: '1px solid #ddd' }}>
				<HorizontalTimelineComponent liveBlogs={liveBlogData.contentCollection.items} lang={lang} />
				<div className={'absolute right-0 top-0 w-24 h-full bg-gradient-to-r from-transparent to-gray-100'} />
			</div>

			{/* Grid for main content */}
			<div className='flex flex-col-reverse sm:grid sm:grid-flow-col sm:grid-cols-9 gap-8 px-3 sm:px-8 mt-3 sm:mt-10 items-start'>
				<Sidebar title={liveBlogData.title} lang={lang} liveBlogPages={liveBlogPages} author={liveBlogEntryCollection.blogEntryAuthor} />
				<div className='relative grid grid-cols-1 col-span-7 gap-0 xl:col-span-5'>
					<h1 className={'text-2xl sm:text-4xl'}>{liveBlogEntryCollection.title}</h1>
					<RichtextComponent content={liveBlogEntryCollection.summary.json} />
					<div className={'flex flex-row w-full justify-between mt-4 pt-2 border-t'}>
						<ArticleChecker lang={lang} slug={liveBlogEntryCollection.slug} setIsRead={true} showRemoveArticle />
						{/* Share buttons */}
						<ShareIcons shareProps={shareProps} dark={false} allIcons={true} />
					</div>
					<div className={'grid grid-cols-1 gap-y-1 mt-8'}>
						{liveBlogEntryCollection.blogEntryContentCollection.items.map((entry, i) => {
							return <DynamicBlogContentComponent key={`blog-entry-content-${i}`} data={entry} lang={lang} />
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

export default LiveBlogEntry

export const getStaticPaths = async () => {
	// Empty array to be filled with all the paths
	let paths = []

	// Querying all the English entries
	const queryEN = `{
		liveBlogCollection(locale: "en", limit: 1, where: { slug: "car-blog-english" }) {
			items {
				contentCollection {
					items {
						... on LiveBlogEntry {
							slug
						}
					}
				}
			}
		}
	}
	`

	// Await English entries query response
	const entriesEN = await callContentful(queryEN)
	const slugsEN = entriesEN.data.liveBlogCollection.items[0].contentCollection.items.map((el) => el.slug)

	// Loop through slugs and add English entries to paths array
	for (let i = 0; i < slugsEN.length; i++) {
		paths.push({
			params: {
				lang: 'en',
				slug: slugsEN[i],
			}
		})
	}

	// Querying all the French entries
	const queryFR = `{
			liveBlogCollection(locale: "fr", limit: 1, where: { slug: "car-blog-french" }) {
				items {
					contentCollection {
						items {
							... on LiveBlogEntry {
								slug
							}
						}
					}
				}
			}
		}
		`

	// Await French entries query response
	const entriesFR = await callContentful(queryFR)
	const slugsFR = entriesFR.data.liveBlogCollection.items[0].contentCollection.items.map((el) => el.slug)

	// Loop through slugs and add French entries to paths array
	for (let i = 0; i < entriesFR.length; i++) {
		paths.push({
			params: {
				lang: 'fr',
				slug: slugsFR[i],
			}
		})
	}

	return {
		// paths: [], //indicates that no page needs be created at build time
		paths: paths,
		fallback: 'blocking', //indicates the type of fallback
	}
}

export const getStaticProps = async (ctx) => {
	let { lang, slug } = ctx.params

	let blogSlug = 'car-blog-english'
	if (lang === 'fr') {
		blogSlug = 'car-blog-french'
	}

	const query = `{
		liveBlogCollection(locale: "${lang}", limit: 1, where: { slug: "${blogSlug}" }) {
			items {
				title
				slug
				summary {
					json
				}
				shareImage {
					url
				}
				shareText
				contentCollection {
					items {
						... on LiveBlogEntry {
							title
							slug
							date
							summary { json }
							type
							blogEntryAuthor {
								name
								slug
								image {
									url
								}
								description {
									json
								}
							}
						}
					}
				}
			}
		}
		liveBlogEntryCollection(
			locale: "${lang}"
			limit: 1
			where: { slug: "${slug}" }
		) {
			items {
				title
				date
				slug
				summary { json }
				type
				blogEntrySocialImage {
					url
				}
				blogEntryAuthor {
					name
					slug
					image {
						fileName
						url
					}
					description {
						json
					}
				}
				blogEntryContentCollection {
					items {
						... on LiveBlogContentText {
							__typename
							title
							text {
								json
							}
						}
						... on LiveBlogContentVideo {
							__typename
							title
							youtubeId
							video {
								fileName
								url
							}
							caption {
								json
							}
							credit
						}
						... on LiveBlogContentAudio {
							__typename
							title
							youtubeId
							audio {
								fileName
								url
							}
							caption {
								json
							}
							credit
						}
						... on LiveBlogContentImageGrid {
							__typename
							imagesCollection {
								items {
									fileName
									url
									width
									height
									title
									description
								}
							}
						}
						... on LiveBlogContentMedia {
							__typename
							title
							media {
							  sys {
								id
							  }
							  url
							  width
							  height
							}
							mediaUrl
							captionFile {
							  fileName
							  url
							}
							captionFileFrench {
								fileName
								url
							  }
							caption {
							  json
							}
							credit
							placeholderImage {
							  sys {
								id
							  }
							  url
							  width
							  height
							}
						}
					}
				}
			}
		}
  }`

	const liveBlogEntry = await callContentful(query)

	const pagesQuery = `{
		liveBlogPageCollection(locale: "${lang}") {
			items {
				title
				slug
			}
		}
	}`

	const liveBlogPages = await callContentful(pagesQuery)

	return {
		props: {
			lang,
			liveBlogEntryCollection: liveBlogEntry.data.liveBlogEntryCollection.items[0],
			liveBlogData: liveBlogEntry.data.liveBlogCollection.items[0],
			liveBlogPages: liveBlogPages.data.liveBlogPageCollection.items,
		},
		revalidate: 60,
	}
}
