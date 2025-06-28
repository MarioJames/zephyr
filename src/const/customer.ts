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

// 行业选项
export const INDUSTRY_OPTIONS = [
  { value: '互联网', label: '互联网' },
  { value: '金融', label: '金融' },
  { value: '教育', label: '教育' },
  { value: '医疗', label: '医疗' },
  { value: '制造业', label: '制造业' },
  { value: '服务业', label: '服务业' },
  { value: '其他', label: '其他' },
];

// 公司规模选项
export const SCALE_OPTIONS = [
  { value: '少于50人', label: '少于50人' },
  { value: '50-200人', label: '50-200人' },
  { value: '200-500人', label: '200-500人' },
  { value: '500-1000人', label: '500-1000人' },
  { value: '1000-5000人', label: '1000-5000人' },
  { value: '5000-10000人', label: '5000-10000人' },
  { value: '10000人以上', label: '10000人以上' },
];

// 省市区级联选择数据
export const PROVINCE_OPTIONS = [
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '北京市',
        label: '北京市',
        children: [
          { value: '朝阳区', label: '朝阳区' },
          { value: '海淀区', label: '海淀区' },
          { value: '西城区', label: '西城区' },
          { value: '东城区', label: '东城区' },
          { value: '丰台区', label: '丰台区' },
        ],
      },
    ],
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      {
        value: '上海市',
        label: '上海市',
        children: [
          { value: '浦东新区', label: '浦东新区' },
          { value: '黄浦区', label: '黄浦区' },
          { value: '徐汇区', label: '徐汇区' },
          { value: '长宁区', label: '长宁区' },
          { value: '静安区', label: '静安区' },
        ],
      },
    ],
  },
  {
    value: '广东省',
    label: '广东省',
    children: [
      {
        value: '广州市',
        label: '广州市',
        children: [
          { value: '天河区', label: '天河区' },
          { value: '海珠区', label: '海珠区' },
          { value: '越秀区', label: '越秀区' },
          { value: '荔湾区', label: '荔湾区' },
        ],
      },
      {
        value: '深圳市',
        label: '深圳市',
        children: [
          { value: '南山区', label: '南山区' },
          { value: '福田区', label: '福田区' },
          { value: '罗湖区', label: '罗湖区' },
          { value: '宝安区', label: '宝安区' },
        ],
      },
    ],
  },
  {
    value: '浙江省',
    label: '浙江省',
    children: [
      {
        value: '杭州市',
        label: '杭州市',
        children: [
          { value: '西湖区', label: '西湖区' },
          { value: '滨江区', label: '滨江区' },
          { value: '江干区', label: '江干区' },
          { value: '拱墅区', label: '拱墅区' },
        ],
      },
    ],
  },
  {
    value: '江苏省',
    label: '江苏省',
    children: [
      {
        value: '南京市',
        label: '南京市',
        children: [
          { value: '秦淮区', label: '秦淮区' },
          { value: '鼓楼区', label: '鼓楼区' },
          { value: '建邺区', label: '建邺区' },
          { value: '玄武区', label: '玄武区' },
        ],
      },
    ],
  },
];
