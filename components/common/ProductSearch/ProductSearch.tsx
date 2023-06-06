// take the input using e.currentTarget.id === productCode

import React from 'react'

import Image from 'next/image'

import styles from '@/components/common/ProductSearch/ProductSearchStyle'
import { useDebounce, useGetSearchSuggestions } from '@/hooks'

const ProductListItem = (props: any) => {
  return (
    <li style={styles.productListItem.li}>
      <button
        // className={Style.wishlistSearch}
        onClick={props.onClick}
        id={props.code}
        style={{
          ...styles.productListItem.button,
          cursor: 'pointer',
          border: 'none',
          textAlign: 'left',
        }}
      >
        {props.image ? (
          <Image
            // className={Style.wishlistSearchImage}
            src={`https:${props.image}`}
            alt={props.name}
            width={40}
            height={40}
            style={{ marginRight: '10px' }}
          />
        ) : null}
        {props.name}
      </button>
    </li>
  )
}

export default function ProductSearch(props: any) {
  const { handleProductItemClick } = props
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
  function handleProductClick(e: any) {
    e.preventDefault()
    console.log(e.currentTarget.id)
    setState({ name: e.currentTarget.id, showSuggestion: false })

    handleProductItemClick(e)
  }
  return (
    <div
      style={{
        ...styles.productSearch.createListSearchProductSection,
        position: 'relative',
        flexDirection: 'column',
      }}
    >
      <label htmlFor="searchProduct">Search for a product</label>
      <input
        placeholder="Search by product name or code"
        id="productCode"
        onChange={handleChange}
        value={state.name}
        style={styles.productSearch.createListSearchProductInput}
      />
      {state.showSuggestion ? (
        <ul
          style={{
            ...styles.productListItem.ul,
            listStyleType: 'unset',
            position: 'absolute',
            overflowY: 'auto',
          }}
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
                    onClick={handleProductClick}
                  />
                )
              })
            : null}
        </ul>
      ) : null}
    </div>
  )
}
