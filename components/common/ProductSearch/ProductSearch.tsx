// take the input using e.currentTarget.id === productCode

import React from 'react'

import Image from 'next/image'

// import styles from './ProductSearch.module.css'
import { useDebounce, useGetSearchSuggestions } from '@/hooks'
// import Style from '@/styles/global.module.css'

// const styles = {
//   createListSearchProductSection: {
//     display:'flex',
//     flexDirection:'column',
//     fontSize:'12px',
//     marginTop:'24px',
//     marginBottom:'46px',
//     position:'relative',
//   },
//   createListSearchProductInput: {
//     maxWidth:'495px',
//     height:'32px',
//     fontSize:' 14px',
//     padding: '8px 12px',
//     background: '#ffffff',
//     border: '1px solid #cdcdcd',
//     border-radius:' 4px'
//   }
// }

const ProductListItem = (props: any) => {
  return (
    <li
    // className={Style.wishlistSearchLI}
    >
      <button
        // className={Style.wishlistSearch}
        onClick={props.onClick}
        id={props.code}
      >
        {props.image ? (
          <Image
            // className={Style.wishlistSearchImage}
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
    <div>
      <label htmlFor="searchProduct">Search for a product</label>
      <input
        placeholder="Search by product name or code"
        id="productCode"
        onChange={handleChange}
        value={state.name}
      />
      {state.showSuggestion ? (
        <ul
          // className={Style.wishlistSearchUl}
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
