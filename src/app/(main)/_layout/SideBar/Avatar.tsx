import { Suspense, memo } from "react";

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
