export interface CustomerFormData {
  // 基本信息
  name: string;
  gender?: string;
  age?: string;
  position?: string;

  // 联系方式
  phone: string;
  email?: string;
  wechat?: string;

  // 公司信息
  company?: string;
  industry?: string;
  scale?: string;

  // 地址信息
  region?: string[];
  address?: string;

  // 备注
  notes?: string;

  // 头像
  avatar?: string;
}

export interface CustomerFormProps {
  mode: 'create' | 'edit';
  initialData?: Partial<CustomerFormData>;
  customerId?: string;
  onSubmit: (data: CustomerFormData & { type: string; avatar?: string }) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

// 性别选项
export const genderOptions = [
  { value: '男', label: '男' },
  { value: '女', label: '女' },
  { value: '其他', label: '其他' },
];

// 年龄选项
export const ageOptions = Array.from({ length: 60 }, (_, i) => {
  const age = i + 18; // 从18岁开始
  return { value: age.toString(), label: `${age}岁` };
});

// 行业选项
export const industryOptions = [
  { value: '互联网', label: '互联网' },
  { value: '金融', label: '金融' },
  { value: '教育', label: '教育' },
  { value: '医疗', label: '医疗' },
  { value: '制造业', label: '制造业' },
  { value: '服务业', label: '服务业' },
  { value: '其他', label: '其他' },
];

// 公司规模选项
export const scaleOptions = [
  { value: '少于50人', label: '少于50人' },
  { value: '50-200人', label: '50-200人' },
  { value: '200-500人', label: '200-500人' },
  { value: '500-1000人', label: '500-1000人' },
  { value: '1000-5000人', label: '1000-5000人' },
  { value: '5000-10000人', label: '5000-10000人' },
  { value: '10000人以上', label: '10000人以上' },
];

// 省市区选项（简化版）
export const provinceOptions = [
  {
    value: '浙江省',
    label: '浙江省',
    children: [
      {
        value: '杭州市',
        label: '杭州市',
        children: [
          { value: '西湖区', label: '西湖区' },
          { value: '余杭区', label: '余杭区' },
          { value: '滨江区', label: '滨江区' },
        ],
      },
      {
        value: '宁波市',
        label: '宁波市',
        children: [
          { value: '海曙区', label: '海曙区' },
          { value: '江北区', label: '江北区' },
        ],
      },
    ],
  },
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
          { value: '东城区', label: '东城区' },
          { value: '西城区', label: '西城区' },
        ],
      },
    ],
  },
];

// 客户类型描述
export const customerTypeOptions = [
  {
    value: 'A',
    label: 'A类客户',
    description: 'A类客户：重要客户，需要重点关注和维护'
  },
  {
    value: 'B',
    label: 'B类客户',
    description: 'B类客户：常规客户，定期维护和跟进'
  },
  {
    value: 'C',
    label: 'C类客户',
    description: 'C类客户：潜在客户，需要培养和发展'
  },
];
