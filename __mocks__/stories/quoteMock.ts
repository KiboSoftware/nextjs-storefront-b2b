import { quotesMock } from './quotesMock'

export const quoteMock = {
  ...quotesMock.items?.[1],
  items: [
    {
      id: '15d502b13a79220001b6ed1b000045a4',
      name: null,
      siteId: 22116,
      tenantId: 17828,
      feeTotal: 0,
      shippingTotal: 0,
      number: 3,
      submittedDate: null,
      expirationDate: null,
      total: 200,
      status: 'Pending',
      subTotal: 200,
      shippingSubTotal: 0,
      handlingSubTotal: 0,
      itemTaxTotal: 0,
      shippingTaxTotal: 0,
      handlingTaxTotal: 0,
      dutyTotal: 0,
      items: [
        {
          id: 'a2dc8f0975294da4bc2cb05a0093fb6c',
          quantity: 2,
          fulfillmentMethod: 'Pickup',
          fulfillmentLocationCode: 'TriptiShop',
          unitPrice: {
            listAmount: 100,
            saleAmount: null,
          },
          discountTotal: 0,
          discountedTotal: 200,
          total: 200,
          shippingTotal: 0,
          dutyAmount: null,
          product: {
            productCode: 'MS-CAM-004',
            name: 'GoPro Hero3 Mount',
            description:
              '<font face="arial, sans-sarif" size="4"><span style="line-height: 18px;">Mount your GoPro Camera to capture the action during all sports.</span></font>',
            imageUrl:
              '//d1slj7rdbjyb5l.cloudfront.net/17194-21127/cms/21127/files/0920dfa6-8e42-4e31-8b07-322c331bf5a4',
            options: [],
            properties: [
              {
                attributeFQN: 'tenant~availability',
                name: 'Availability',
                values: [
                  {
                    value: '24-48hrs',
                  },
                ],
              },
              {
                attributeFQN: 'tenant~rating',
                name: 'Rating',
                values: [
                  {
                    value: 2,
                  },
                ],
              },
              {
                attributeFQN: 'tenant~popularity',
                name: 'Popularity',
                values: [
                  {
                    value: 2,
                  },
                ],
              },
              {
                attributeFQN: 'Tenant~brand',
                name: 'Brand',
                values: [
                  {
                    value: 'GoPro',
                  },
                ],
              },
            ],
            sku: null,
            price: {
              price: 100,
              salePrice: null,
            },
            categories: [
              {
                id: 2,
              },
              {
                id: 4,
              },
              {
                id: 19,
              },
            ],
          },
        },
      ],
      auditInfo: {
        updateDate: 1691690035699,
        createDate: 1691657393546,
        updateBy: 'c43fd8c426a34e5bae5a7445dee2fa86',
        createBy: 'c43fd8c426a34e5bae5a7445dee2fa86',
      },
      auditHistory: [],
      comments: [],
      fulfillmentInfo: null,
      userId: 'c43fd8c426a34e5bae5a7445dee2fa86',
      customerAccountId: 1174,
      itemLevelHandlingDiscountTotal: 0,
      itemLevelShippingDiscountTotal: 0,
      itemLevelProductDiscountTotal: 0,
      handlingTotal: 0,
      itemTotal: 0,
      orderLevelHandlingDiscountTotal: 0,
      orderLevelProductDiscountTotal: 0,
      shippingAmount: 0,
      orderLevelShippingDiscountTotal: 0,
    },
    {
      id: '0860acf067ab47a5a31db04a00b2d3d2',
      fulfillmentLocationCode: '12346',
      fulfillmentMethod: 'Ship',
      isReservationEnabled: false,
      lineId: 2,
      product: {
        fulfillmentTypesSupported: ['DirectShip'],
        imageAlternateText: '',
        imageUrl:
          '//cdn-sb.mozu.com/37691-59868/cms/59868/files/b99729b9-ec00-4ca0-837e-3282a7ea1f3b',
        options: [],
        properties: [],
        categories: [
          {
            id: 3,
            parent: {
              id: 2,
            },
          },
          {
            id: 5,
            parent: {
              id: 2,
            },
          },
        ],
        price: {
          price: 520.99,
        },
        discountsRestricted: false,
        isRecurring: false,
        isTaxable: true,
        productType: 'Default',
        productUsage: 'Standard',
        bundledProducts: [],
        productCode: '12345',
        name: 'Double Door Refrigerator',
        description: 'Digital Inverter Frost Free',
        goodsType: 'Physical',
        isPackagedStandAlone: false,
        stock: {
          manageStock: true,
          isOnBackOrder: false,
          isSubstitutable: false,
        },
        measurements: {
          height: {
            unit: 'in',
            value: 1,
          },
          width: {
            unit: 'in',
            value: 1,
          },
          length: {
            unit: 'in',
            value: 1,
          },
          weight: {
            unit: 'lbs',
            value: 1,
          },
        },
        fulfillmentStatus: 'Pending',
      },
      quantity: 1,
      subtotal: 520.99,
      extendedTotal: 520.99,
      taxableTotal: 520.99,
      discountTotal: 0,
      discountedTotal: 520.99,
      itemTaxTotal: 0,
      shippingTaxTotal: 0,
      shippingTotal: 0,
      feeTotal: 0,
      total: 520.99,
      unitPrice: {
        extendedAmount: 520.99,
        listAmount: 520.99,
      },
      productDiscounts: [],
      shippingDiscounts: [],
      auditInfo: {},
      shippingAmountBeforeDiscountsAndAdjustments: 0,
      weightedOrderDiscount: 0,
      weightedOrderShippingDiscount: 0,
      weightedOrderHandlingFeeDiscount: 0,
      isAssemblyRequired: false,
    },
  ],
  comments: [
    {
      id: 'f0089587920a4ba987d3b04a00b14b39',
      text: 'Sent a new Quote Request',
      auditInfo: {
        updateDate: '2023-07-25T10:45:30.427Z',
        createDate: '2023-07-25T10:45:30.427Z',
        updateBy: '0abbfb8811d94deba8e9f13906173a0f',
        createBy: '0abbfb8811d94deba8e9f13906173a0f',
      },
    },
    {
      id: '99e4ecf9f4c742d08ad6b04b00cffeb9',
      text: 'Changed Price',
      auditInfo: {
        updateDate: '2023-07-26T12:37:17.201Z',
        createDate: '2023-07-26T12:37:17.201Z',
        updateBy: '0abbfb8811d94debt6e9f13906173a0f',
        createBy: '0abbfb8811d94debt6e9f13906173a0f',
      },
    },
    {
      id: 'b3a1f0e8e1d648c4a36e7b05c1f2f823',
      text: 'Sent a new Quote Request Again',
      auditInfo: {
        updateDate: '2023-07-26T12:37:17.201Z',
        createDate: '2023-07-26T12:37:17.201Z',
        updateBy: '0abbfb8811d94deba8e9f13906173a0f',
        createBy: '0abbfb8811d94deba8e9f13906173a0f',
      },
    },
    {
      id: 'c52f98a1b7d542f1b9e6c3d6a8f1e4c7',
      text: 'Check again',
      auditInfo: {
        updateDate: '2023-07-26T12:37:17.201Z',
        createDate: '2023-07-26T12:37:17.201Z',
        updateBy: '0abbfb8811d94debt6e9f13906173a0f',
        createBy: '0abbfb8811d94debt6e9f13906173a0f',
      },
    },
  ],
  fulfillmentInfo: {
    fulfillmentContact: {
      id: 2,
      firstName: 'sushant',
      lastNameOrSurname: 'jadhav',
      companyOrOrganization: 'Sushant Account',
      phoneNumbers: {
        home: '+919284428455',
      },
      address: {
        address1: 'pune',
        address2: '',
        cityOrTown: 'pune',
        stateOrProvince: 'MH',
        postalOrZipCode: '411033',
        countryCode: 'IN',
        addressType: 'Residential',
        isValidated: false,
      },
    },
    auditInfo: {
      updateDate: '2023-07-25T10:39:24.626Z',
      createDate: '2023-07-25T10:39:24.626Z',
      updateBy: '0abbfb8811d94deba8e9f13906173a0f',
      createBy: '0abbfb8811d94deba8e9f13906173a0f',
    },
  },
  auditHistory: [
    {
      id: 'de280f88c5e94d5fb3cfb04a00a2e3fe',
      changes: [
        {
          type: 'Update',
          fields: [
            {
              name: 'Name',
              newValue: 'Quote 73 - Draft',
            },
          ],
        },
      ],
      auditInfo: {
        updateDate: '2023-07-25T09:53:03.990Z',
        createDate: '2023-07-25T09:53:03.990Z',
        updateBy: '0abbfb8811d94deba8e9f13906173a0f',
        createBy: '0abbfb8811d94deba8e9f13906173a0f',
      },
    },
    {
      id: 'cd4fb68b491a48ebb530b04a00a2fb03',
      changes: [
        {
          type: 'Add',
          path: 'Items#1',
          fields: [
            {
              name: 'ProductCode',
              newValue: '00011',
            },
            {
              name: 'Name',
              newValue: 'Sneaker',
            },
            {
              name: 'Quantity',
              newValue: '1',
            },
            {
              name: 'FulfillmentMethod',
              newValue: 'Ship',
            },
            {
              name: 'FulfillmentLocationCode',
              newValue: '12346',
            },
            {
              name: 'UnitPrice',
              newValue: '45.99',
            },
          ],
        },
      ],
      auditInfo: {
        updateDate: '2023-07-25T09:53:23.635Z',
        createDate: '2023-07-25T09:53:23.635Z',
        updateBy: '0abbfb8811d94deba8e9f13906173a0f',
        createBy: '0abbfb8811d94deba8e9f13906173a0f',
      },
    },
    {
      id: 'c11f56b4c3ce4ba88b87b04a00a6eef4',
      changes: [
        {
          type: 'Update',
          fields: [
            {
              name: 'Name',
              oldValue: 'Quote 73 - Draft',
              newValue: 'Quote 73 - Draft 1',
            },
          ],
        },
      ],
      auditInfo: {
        updateDate: '2023-07-25T10:07:47.157Z',
        createDate: '2023-07-25T10:07:47.157Z',
        updateBy: '0abbfb8811d94deba8e9f13906173a0f',
        createBy: '0abbfb8811d94deba8e9f13906173a0f',
      },
    },
    {
      id: '1574078b65654c17a554b04a00a6f481',
      changes: [
        {
          type: 'Update',
          fields: [
            {
              name: 'Name',
              oldValue: 'Quote 73 - Draft 1',
              newValue: 'Quote 73 - Draft',
            },
          ],
        },
      ],
      auditInfo: {
        updateDate: '2023-07-25T10:07:51.894Z',
        createDate: '2023-07-25T10:07:51.894Z',
        updateBy: '0abbfb8811d94deba8e9f13906173a0f',
        createBy: '0abbfb8811d94deba8e9f13906173a0f',
      },
    },
    {
      id: 'e632d21f8f5b4813b9c3b04a00ae9af6',
      changes: [
        {
          type: 'Update',
          fields: [
            {
              name: 'Name',
              oldValue: 'Quote 73 - Draft',
              newValue: 'Quote 73 - Draft 1',
            },
          ],
        },
      ],
      auditInfo: {
        updateDate: '2023-07-25T10:35:43.112Z',
        createDate: '2023-07-25T10:35:43.112Z',
        updateBy: '0abbfb8811d94deba8e9f13906173a0f',
        createBy: '0abbfb8811d94deba8e9f13906173a0f',
      },
    },
  ],
}
