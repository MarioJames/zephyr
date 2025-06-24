import { Icon, Segmented } from "@lobehub/ui";
import { SegmentedLabeledOption } from "antd/es/segmented";
import { AsteriskSquare } from "lucide-react";
import { memo } from "react";
import { Flexbox } from "react-layout-kit";

import AccessCodeForm from "./AccessCodeForm";
import { ErrorActionContainer } from "./style";

interface InvalidAccessCodeProps {
  id: string;
  provider?: string;
}

const InvalidAccessCode = memo<InvalidAccessCodeProps>(({ id }) => {
  return (
    <ErrorActionContainer>
      <Segmented
        block
        options={
          [
            {
              icon: <Icon icon={AsteriskSquare} />,
              label: "密码登录",
              value: "password",
            },
          ].filter(Boolean) as SegmentedLabeledOption[]
        }
        style={{ width: "100%" }}
        value={"password"}
        variant={"filled"}
      />

      <Flexbox gap={24}>
        <AccessCodeForm id={id} />
      </Flexbox>
    </ErrorActionContainer>
  );
});

export default InvalidAccessCode;
