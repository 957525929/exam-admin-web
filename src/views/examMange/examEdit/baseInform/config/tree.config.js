export const treeConfig = {
  tree: [
    {
      title: '校区A',
      key: '1-1',
      status: 'school',
      scopedSlots: { title: 'custom' },
      children: [
        {
          title: '2022-A班',
          key: '1-1-1',
          status: 'class',
          scopedSlots: { title: 'custom' },
          isLeaf: true,
        },
        {
          title: '2021-A班',
          key: '1-1-2',
          status: 'class',
          scopedSlots: { title: 'custom' },
          isLeaf: true,
        },
      ],
    },
    {
      title: '校区B',
      key: '1-2',
      status: 'school',
      scopedSlots: { title: 'custom' },
    },
    {
      title: '校区C',
      key: '1-3',
      status: 'school',
      scopedSlots: { title: 'custom' },
    },
    {
      title: '校区D',
      key: '1-4',
      scopedSlots: { title: 'custom' },
    },
  ],
}
