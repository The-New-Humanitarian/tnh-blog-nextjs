import React, { useEffect, useState } from 'react';

import Image from "next/image"
import Link from 'next/link'

import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import TweetComponent from '@components/embeddedTweet'

// const website_url = 'thenewhumanitarian.org'

const RichtextComponent = (props) => {
	const { content, className, assets } = props

	const [isLoadedInIframe, setIsLoadedInIframe] = useState(false);

	useEffect(() => {
		// Check if the component is loaded inside an iframe
		setIsLoadedInIframe(window.self !== window.top);
	}, []);

	const options = {
		renderMark: {
			[MARKS.BOLD]: (text) => <strong>{text}</strong>,
			[MARKS.UNDERLINE]: (text) => <u>{text}</u>,
			[BLOCKS.HEADING_1]: (text) => <h1>{text}</h1>,
			[BLOCKS.HEADING_2]: (text) => <h2>{text}</h2>,
			[BLOCKS.HEADING_3]: (text) => <h3>{text}</h3>,
			[BLOCKS.HEADING_4]: (text) => <h4>{text}</h4>,
			[BLOCKS.HEADING_5]: (text) => <h5>{text}</h5>,
			[BLOCKS.LIST_ITEM]: (text) => <li>{text}</li>,
			[BLOCKS.UL_LIST]: (text) => <ul>{text}</ul>,
			[BLOCKS.OL_LIST]: (text) => <ol>{text}</ol>,
		},
		renderNode: {
			[INLINES.HYPERLINK]: (node) => {
				// Set target and rel attributes based on whether it's in an iframe or not
				const target = isLoadedInIframe ? '_blank' : '_parent';
				const rel = isLoadedInIframe ? 'noopener noreferrer' : '';

				return (
					<Link href={node.data.uri} target={target} rel={rel}>
						{node.content[0].value}
					</Link>
				);
			},
			[BLOCKS.PARAGRAPH]: (node, children) => <p className={'mb-3'}>{children}</p>,
			[BLOCKS.HEADING_6]: (node, children) => <p>{children}</p>,
			[BLOCKS.HR]: () => <hr className={'mt-5 mb-8'} />,
			[BLOCKS.EMBEDDED_ASSET]: (node) => {
				// console.log(node)

				// Find the asset in the assets array by matching node.data.target.sys.id with asset.sys.id
				const asset = assets.find((asset) => asset.sys.id === node.data.target.sys.id)
				console.log(asset)

				const image = {
					url: asset.url,
					width: asset.width,
					height: asset.height,
					fileName: asset.fileName,
				}

				return <Image src={image.url} width={image.width} height={image.height} className={'my-5 w-full object-cover'} />
			},
			[BLOCKS.EMBEDDED_ENTRY]: (node) => {
				const contentType = node.data.target.sys.contentType.sys.id
				if (contentType === 'tweet') {
					return (
						<div className={'text-burgundy'}>
							<TweetComponent id={node.data.target.fields.id} />
						</div>
					)
				} else {
					return <h1 className={'text-burgundy'}>Missing component in richtext module.</h1>
				}
			},
		},
	}

	return <div className={className}>{documentToReactComponents(content, options)}</div>
}

export default RichtextComponent
