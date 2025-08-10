import { Suspense, memo } from "react";

import UserAvatar from "@/features/User/UserAvatar";
import UserPanel from "@/features/User/UserPanel";

const Avatar = memo(() => {
  return (
    <Suspense fallback={<UserAvatar />}>
      <UserPanel>
        <UserAvatar clickable />
      </UserPanel>
    </Suspense>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;
