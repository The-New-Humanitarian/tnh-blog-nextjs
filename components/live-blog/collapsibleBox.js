import { useState } from 'react'

import RichtextComponent from "@components/richText"

const CollapsibleBox = ({ author, content, assets, openByDefault }) => {
    const [isOpen, setIsOpen] = useState(openByDefault)

    return (
        <div className={`relative w-full bg-zinc-50 ${isOpen ? '' : 'h-56'} overflow-hidden`}>
            <div className={'p-3 pb-6 sm:p-5 sm:pb-8'}>
                <div className={'flex items-center justify-start mb-3'}>
                    {author.image && (
                        <div>
                            <img src={author.image.url} className={'w-20 h-20 rounded-full mr-3'} />
                        </div>
                    )}
                    <div>
                        <p>Read more about the author:</p>
                        <h1>{author.name}</h1>
                    </div>
                </div>
                <hr className={'mb-5'} />
                <RichtextComponent content={content} assets={assets} />
            </div>
            <div onClick={() => setIsOpen(!isOpen)} className={'bg-zinc-200 m-0 absolute bottom-0 left-0 w-full cursor-pointer'}>
                <p className={'text-center p-1 font-bold'}>
                    {isOpen ? 'Close' : 'Read more...'}
                </p>
            </div>
        </div>
    )
}

export default CollapsibleBox