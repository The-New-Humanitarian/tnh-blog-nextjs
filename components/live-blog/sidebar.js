import Link from 'next/link'
import LanguageSwitch from '@components/live-blog/languageSwitch'
import ArticleFilter from '@components/live-blog/articleFilter'
import ArticleAuthorInfo from '@components/live-blog/articleAuthorInfo'

const Sidebar = ({ lang, title, liveBlogPages, showFilter, currentFilter, hideBackButton, author, className }) => {
	return (
		<div className={`${className || ''} col-span-2 bg-burgundy sm:bg-transparent p-3 sm:p-0 w-full text-white sm:text-inherit`}>
			{!hideBackButton && (
				<Link href={`${lang === 'en' ? '/' + process.env.NEXT_PUBLIC_CAR_BLOG_URL + '/en/' : '/' + process.env.NEXT_PUBLIC_CAR_BLOG_URL + '/fr/'}`}>
					<button className={'border-white border sm:border-none bg-burgundy px-3 py-2 text-white font-normal text-sm mb-5'}>{lang === 'en' ? '← Overview' : '← Retour'}</button>
				</Link>
			)}
			<h2 className={'text-white sm:text-black'}>{title}</h2>
			<ul className={'list-none m-0 grid pt-2'}>
				{liveBlogPages.map((el, i) => {
					return (
						<li key={`live-blog-page-link-${i}-${el.slug}-${Math.random()}`}>
							<Link className={'text-white sm:text-inherit'} href={`/${process.env.NEXT_PUBLIC_CAR_BLOG_URL}/${lang}/pages/${el.slug}`}>{el.title}</Link>
						</li>
					)
				})}
				<LanguageSwitch lang={lang} baseUrl={`/${process.env.NEXT_PUBLIC_CAR_BLOG_URL}`} />
				{showFilter && <ArticleFilter lang={lang} authors={showFilter} currentFilter={currentFilter} />}
				{author && <ArticleAuthorInfo lang={lang} author={author} />}
			</ul>
			{/* <div className='onesignal-customlink-container' /> */}
		</div>
	)
}

export default Sidebar
