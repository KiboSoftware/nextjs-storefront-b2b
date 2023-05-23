// take the input using e.currentTarget.id === productCode

import React from 'react'

import Image from 'next/image'

import styles from './ProductSearch.module.css'
import { useDebounce, useGetSearchSuggestions } from '@/hooks'
import Style from '@/styles/global.module.css'

const ProductListItem = (props: any) => {
  return (
    <li className={Style.wishlistSearchLI}>
      {' '}
      <button className={Style.wishlistSearch} onClick={props.onClick} id={props.code}>
        {props.image ? (
          <Image
            className={Style.wishlistSearchImage}
            src={`https:${props.image}`}
            alt={props.name}
            width={20}
            height={20}
          />
        ) : null}
        {props.name}
      </button>
    </li>
  )
}

export default function ProductSearch(props: any) {
  const [state, setState] = React.useState({
    name: '',
    showSuggestion: false,
  })

  let productSuggestionGroup
  const searchSuggestionResult = useGetSearchSuggestions(useDebounce(state.name.trim(), 300))
  if (state.showSuggestion) {
    const getSuggestionGroup = (title: string) =>
      searchSuggestionResult.data
        ? searchSuggestionResult.data?.suggestionGroups?.find((sg: any) => sg?.name === title)
        : null
    productSuggestionGroup = getSuggestionGroup('Pages')
  }
  function handleChange(e: any) {
    setState({ name: e.target.value, showSuggestion: e.target.value.length > 2 })
  }
  function handleProductItemClick(e: any) {
    e.preventDefault()
    console.log(e.currentTarget.id)
    setState({ name: e.currentTarget.id, showSuggestion: false })
    props.handleProductItemClick(e)
  }
  return (
    <div className={`${styles.createListSearchProductSection}`}>
      <label htmlFor="searchProduct">Search for a product</label>
      <input
        className={`${styles.createListSearchProductInput}`}
        placeholder="Search by product name or code"
        id="productCode"
        onChange={handleChange}
        value={state.name}
      />
      {state.showSuggestion ? (
        <ul
          className={Style.wishlistSearchUl}
          style={{ position: 'absolute', top: '100%', left: '0px' }}
        >
          {state.showSuggestion
            ? productSuggestionGroup?.suggestions?.map((item: any) => {
                return (
                  <ProductListItem
                    className="list"
                    key={item?.suggestion?.product}
                    name={item?.suggestion?.content?.productName}
                    code={item?.suggestion?.productCode}
                    image={
                      item?.suggestion?.productImageUrls
                        ? item?.suggestion?.productImageUrls[0]
                        : null
                    }
                    item={item}
                    onClick={handleProductItemClick}
                  />
                )
              })
            : null}
        </ul>
      ) : null}
    </div>
  )
}
