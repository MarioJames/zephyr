import { ActionIcon } from "@lobehub/ui";
import { Tooltip } from "antd";
import { LucideX } from "lucide-react";
import { Suspense, memo } from "react";
import { Flexbox } from "react-layout-kit";

import UserAvatar from "@/features/User/UserAvatar";

const Avatar = memo(() => {
  return (
    <Suspense fallback={<UserAvatar />}>
      <UserAvatar clickable />
    </Suspense>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;
