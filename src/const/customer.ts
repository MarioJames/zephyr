// 性别选项
export const GENDER_OPTIONS = [
  { value: '男', label: '男' },
  { value: '女', label: '女' },
];

// 年龄选项
export const AGE_OPTIONS = Array.from({ length: 60 }, (_, i) => {
  const age = i + 18; // 从18岁开始
  return { value: age.toString(), label: `${age}岁` };
});

// 婚姻状况选项
export const MARITAL_STATUS_OPTIONS = [
  { value: 'Unmarried', label: '未婚' },
  { value: 'Married', label: '已婚' },
];
