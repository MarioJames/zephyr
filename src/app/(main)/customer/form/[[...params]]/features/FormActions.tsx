import { Button } from "@lobehub/ui";
import { FormActionsProps } from "./shared/types";
import { useSharedStyles } from "./shared/styles";
import { useGlobalStore } from "@/store/global";
import { globalSelectors } from "@/store/global/selectors";
import { useRouter } from "next/navigation";

export default function FormActions({
  mode,
  submitting,
  onCancel,
}: FormActionsProps) {
  const { styles } = useSharedStyles();
  const isAdmin = useGlobalStore(globalSelectors.isCurrentUserAdmin);
  const router = useRouter();
  return (
    <div className={styles.buttonsContainer}>
      <Button htmlType="submit" loading={submitting} type="primary">
        {mode === "edit" ? "更新客户" : "添加客户"}
      </Button>
      <Button
        onClick={() => {
          if (!isAdmin) {
            router.push("/chat");
            return;
          }
          onCancel();
        }}
      >
        取消
      </Button>
    </div>
  );
}
