import * as React from 'react'

import { BaseContentBlock } from 'notion-types'

import { Text } from '../components/text'
import { useNotionContext } from '../context'

export const Tweet: React.FC<{
  block: BaseContentBlock
}> = ({ block }) => {
  const { recordMap, components } = useNotionContext()

  if (!block) {
    return null
  }

  const style: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center',
    width: '100%',
    maxWidth: '100%',
    flexDirection: 'column'
  }

  const assetStyle: React.CSSProperties = {}
  // console.log('asset', block)

  if (block.format) {
    const {
      block_aspect_ratio,
      block_height,
      block_width,
      block_full_width,
      block_page_width,
      block_preserve_scale
    } = block.format

    if (block_full_width || block_page_width) {
      if (block_full_width) {
        style.width = '100vw'
      } else {
        style.width = '100%'
      }

      if (block_aspect_ratio) {
        style.paddingBottom = `${block_aspect_ratio * 100}%`
      } else if (block_height) {
        style.height = block_height
      } else if (block_preserve_scale) {
        // TODO: this is just a guess
        style.paddingBottom = '75%'
        style.minHeight = 100
      }
    } else {
      switch (block.format?.block_alignment) {
        case 'center': {
          style.alignSelf = 'center'
          break
        }
        case 'left': {
          style.alignSelf = 'start'
          break
        }
        case 'right': {
          style.alignSelf = 'end'
          break
        }
      }

      if (block_width) {
        style.width = block_width
      }

      if (block_preserve_scale) {
        style.paddingBottom = '50%'
        style.minHeight = 100
      } else {
        if (block_height) {
          style.height = block_height
        }
      }
    }

    assetStyle.objectFit = 'contain'
  }

  const source =
    recordMap.signed_urls?.[block.id] || block.properties?.source?.[0]?.[0]
  let content = null

  if (!source) {
    return null
  }

  const src = source
  if (!src) return null

  const id = src.split('?')[0].split('/').pop()
  if (!id) return null

  content = (
    <div
      style={{
        ...assetStyle,
        maxWidth: 420,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      <components.Tweet id={id} />
    </div>
  )

  const children = (
    <>
      {block?.properties?.caption && (
        <figcaption className='notion-asset-caption'>
          <Text value={block.properties.caption} block={block as any} />
        </figcaption>
      )}
    </>
  )

  return (
    <>
      <div style={style}>{content}</div>

      {children}
    </>
  )
}
