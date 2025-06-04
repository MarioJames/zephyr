import { Button, Input, Select, Tooltip } from "@lobehub/ui";
import { Checkbox, Radio, Space, Typography } from "antd";
import { SearchIcon } from "lucide-react";
import { ReactNode, memo, useState } from "react";
import { useChatStore } from "@/store/chat";
import { chatToolSelectors } from "@/store/chat/selectors";
import { SearchQuery } from "@/types/tool/search";

import { CATEGORY_ICON_MAP, ENGINE_ICON_MAP } from "../const";
import { CategoryAvatar } from "./CategoryAvatar";
import { EngineAvatar } from "./EngineAvatar";
import { Flexbox } from "react-layout-kit";

interface SearchBarProps {
  aiSummary?: boolean;
  defaultCategories?: string[];
  defaultEngines?: string[];
  defaultQuery: string;
  defaultTimeRange?: string;
  messageId: string;
  onSearch?: (searchQuery: SearchQuery) => void;
  searchAddon?: ReactNode;
  tooltip?: boolean;
}

// 中文枚举映射
const CATEGORY_LABEL_MAP: Record<string, string> = {
  files: '文件',
  general: '通用',
  images: '图片',
  it: '信息技术',
  map: '地图',
  music: '音乐',
  news: '新闻',
  science: '科学',
  social_media: '社交媒体',
  videos: '视频',
};

const SearchBar = memo<SearchBarProps>(
  ({
    defaultCategories = [],
    defaultEngines = [],
    defaultTimeRange,
    aiSummary = true,
    defaultQuery,
    tooltip = true,
    searchAddon,
    onSearch,
    messageId,
  }) => {
    const loading = useChatStore(
      chatToolSelectors.isSearXNGSearching(messageId)
    );
    const [query, setQuery] = useState(defaultQuery);
    const [categories, setCategories] = useState(defaultCategories);
    const [engines, setEngines] = useState(defaultEngines);
    const [time_range, setTimeRange] = useState(defaultTimeRange);
    const [reSearchWithSearXNG] = useChatStore((s) => [s.triggerSearchAgain]);

    const updateAndSearch = async () => {
      const data: SearchQuery = {
        query,
        searchCategories: categories,
        searchEngines: engines,
        searchTimeRange: time_range,
      };
      onSearch?.(data);
      await reSearchWithSearXNG(messageId, data, { aiSummary });
    };

    const searchButton = (
      <Button
        icon={SearchIcon}
        loading={loading}
        onClick={updateAndSearch}
        type={"primary"}
      >
        {"搜索"}
      </Button>
    );

    return (
      <Flexbox gap={16}>
        <Flexbox align={"center"} flex={1} gap={8} height={32} horizontal>
          <Space.Compact style={{ width: "100%" }}>
            <Input
              autoFocus
              onChange={(e) => {
                setQuery(e.target.value);
              }}
              onPressEnter={updateAndSearch}
              placeholder={"请输入搜索内容"}
              style={{ minWidth: 400 }}
              value={query}
              variant={"filled"}
            />
            {tooltip ? (
              <Tooltip title={"点击搜索"}>{searchButton}</Tooltip>
            ) : (
              searchButton
            )}
          </Space.Compact>
          {searchAddon}
        </Flexbox>

        <Flexbox align={"flex-start"} gap={8} horizontal>
          <Typography.Text
            style={{ marginTop: 2, wordBreak: "keep-all" }}
            type={"secondary"}
          >
            {"搜索引擎"}
          </Typography.Text>
          <Checkbox.Group
            onChange={(checkedValue) => {
              setEngines(checkedValue);
            }}
            options={Object.keys(ENGINE_ICON_MAP).map((item) => ({
              label: (
                <Flexbox align={"center"} gap={8} horizontal>
                  <EngineAvatar engine={item} />
                  {item}
                </Flexbox>
              ),
              value: item,
            }))}
            value={engines}
          />
        </Flexbox>
        <Flexbox align="flex-start" gap={8} horizontal>
          <Typography.Text
            style={{ marginTop: 2, wordBreak: "keep-all" }}
            type={"secondary"}
          >
            {"搜索分类"}
          </Typography.Text>
          <Checkbox.Group
            onChange={(checkedValue) => setCategories(checkedValue)}
            options={Object.keys(CATEGORY_ICON_MAP).map((item) => ({
              label: (
                <Flexbox align={"center"} gap={8} horizontal>
                  <CategoryAvatar category={item as any} />
                  {CATEGORY_LABEL_MAP[item] || item}
                </Flexbox>
              ),
              value: item,
            }))}
            value={categories}
          />
        </Flexbox>

        <Flexbox align={"center"} gap={16} horizontal wrap={"wrap"}>
          <Typography.Text type={"secondary"}>{"时间范围"}</Typography.Text>
          <Radio.Group
            onChange={(e) => setTimeRange(e.target.value)}
            optionType="button"
            options={[
              { label: "不限", value: "anytime" },
              { label: "一天内", value: "day" },
              { label: "一周内", value: "week" },
              { label: "一月内", value: "month" },
              { label: "一年内", value: "year" },
            ]}
            value={time_range}
          />
        </Flexbox>
      </Flexbox>
    );
  }
);
export default SearchBar;
