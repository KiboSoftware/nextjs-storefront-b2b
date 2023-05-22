function getDate(date: number) {
  const d = new Date(date)
  const dateString = `${d.getDate()}/${d.getMonth()}/${d.getFullYear()}`
  return dateString
}
export const wishlistTableMock: any = {
  rows: [
    {
      customerAccountId: 1001,
      name: 'Test 1',
      id: '155d21bc2d0fa8000112ee1e0000933b',
      createDate: getDate(1683801019567),
      createBy: 'c4c4c72d881c4b01bdda6148bf8f4f65',
      items: [],
    },
    {
      customerAccountId: 1001,
      name: 'Test 2',
      id: '155d21b3683c0c0001b1e5a90000933b',
      createDate: getDate(1683801011663),
      createBy: 'c4c4c72d881c4b01bdda6148bf8f4f65',
      items: [],
    },
  ],
  pageCount: 1,
  pageSize: 1,
  startIndex: 1,
  totalCount: 1,
}
