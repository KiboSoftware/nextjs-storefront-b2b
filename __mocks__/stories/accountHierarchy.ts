const commerceSummary = {
  totalOrderAmount: {
    amount: 0,
  },
  orderCount: 0,
  wishlistCount: 0,
  visitsCount: 0,
}

const updatedAndCreatedBy = {
  updateBy: 'tbd',
  createBy: 'tbd',
}

const userFlags = {
  isLocked: false,
  isActive: true,
  isRemoved: false,
  acceptsMarketing: false,
  hasExternalPassword: false,
}

export const accountHierarchy = {
  accounts: [
    {
      users: [
        {
          emailAddress: 'sushant.jadhav@kibocommerce.com',
          userName: 'sushant.jadhav@kibocommerce.com',
          firstName: 'Sushant',
          lastName: 'Jadhav',
          localeCode: 'en-us',
          userId: '0abbfb8811d94deba8e9f13906173a0f',
          ...userFlags,
        },
        {
          emailAddress: 'geetanshu.chhabra@kibocommerce.com',
          userName: 'geetanshu.chhabra@kibocommerce.com',
          firstName: 'Geetanshu',
          lastName: 'chabbra',
          localeCode: 'en-US',
          userId: 'c0a204d4fce347f1ac059eb4814dfbbd',
          ...userFlags,
        },
      ],
      isActive: true,
      salesReps: [],
      rootAccountId: 1004,
      approvalStatus: 'Approved',
      id: 1004,
      customerSet: 'default',
      commerceSummary,
      companyOrOrganization: 'Sushant Account',
      segments: [],
      taxExempt: false,
      taxId: '123456',
      auditInfo: {
        updateDate: '2023-07-20T06:36:32.782Z',
        createDate: '2023-04-17T06:45:26.149Z',
        ...updatedAndCreatedBy,
      },
      customerSinceDate: '2023-04-17T06:45:26.149Z',
      accountType: 'B2B',
      migrationRequired: false,
    },
    {
      users: [
        {
          emailAddress: 'sushant2006@gmail.com',
          userName: 'sushant2006@gmail.com',
          firstName: 'Jadhav',
          localeCode: 'en-IN',
          userId: 'd05881f3aa3e4fe8b16fd335fac1515d',
          ...userFlags,
        },
      ],
      isActive: true,
      salesReps: [],
      rootAccountId: 1004,
      parentAccountId: 1004,
      approvalStatus: 'Approved',
      id: 1022,
      customerSet: 'default',
      commerceSummary,
      companyOrOrganization: 'Child 2',
      segments: [],
      taxExempt: false,
      taxId: '123456',
      auditInfo: {
        updateDate: '2023-07-20T05:24:25.359Z',
        createDate: '2023-07-20T05:24:25.359Z',
        ...updatedAndCreatedBy,
      },
      customerSinceDate: '2023-07-20T05:24:25.355Z',
      accountType: 'B2B',
      migrationRequired: false,
    },
    {
      users: [
        {
          emailAddress: 'sushant2005@gmail.com',
          userName: 'sushant2005@gmail.com',
          firstName: 'Jadhav',
          localeCode: 'en-IN',
          userId: 'acb5518aa25f469b945eff274561f2df',
          ...userFlags,
        },
      ],
      isActive: true,
      salesReps: [],
      rootAccountId: 1004,
      parentAccountId: 1022,
      approvalStatus: 'Approved',
      id: 1020,
      customerSet: 'default',
      commerceSummary,
      companyOrOrganization: 'Child 1',
      segments: [],
      taxExempt: false,
      taxId: '123456',
      auditInfo: {
        updateDate: '2023-07-21T06:39:41.769Z',
        createDate: '2023-07-19T08:38:02.409Z',
        ...updatedAndCreatedBy,
      },
      customerSinceDate: '2023-07-19T08:38:02.403Z',
      accountType: 'B2B',
      migrationRequired: false,
    },
    {
      users: [
        {
          emailAddress: 'sushant2007@gmail.com',
          userName: 'sushant2007@gmail.com',
          firstName: 'Jadhav',
          localeCode: 'en-IN',
          userId: 'accb4762028b4622af0d5ae99f29bc0c',
          ...userFlags,
        },
      ],
      isActive: true,
      salesReps: [],
      rootAccountId: 1004,
      parentAccountId: 1022,
      approvalStatus: 'Approved',
      id: 1024,
      customerSet: 'default',
      commerceSummary,
      companyOrOrganization: 'Child 3',
      segments: [],
      taxExempt: false,
      taxId: '123456',
      auditInfo: {
        updateDate: '2023-07-21T06:54:14.079Z',
        createDate: '2023-07-21T06:15:38.934Z',
        ...updatedAndCreatedBy,
      },
      customerSinceDate: '2023-07-21T06:15:38.931Z',
      accountType: 'B2B',
      migrationRequired: false,
    },
  ],
  hierarchy: {
    id: 1004,
    children: [
      {
        id: 1022,
        children: [
          {
            id: 1020,
            children: [],
          },
          {
            id: 1024,
            children: [],
          },
        ],
      },
    ],
  },
}
