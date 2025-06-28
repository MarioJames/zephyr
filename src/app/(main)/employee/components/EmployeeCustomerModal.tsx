import React from "react";
import { Modal, Button, Tabs, Checkbox } from "antd";
import SkeletonList from "./SkeletonList";
import { DoubleRightOutlined, DoubleLeftOutlined } from "@ant-design/icons";

interface Customer {
  id: string;
  customerName: string;
  employeeName?: string;
  username?: string;
}

interface EmployeeCustomerModalProps {
  open: boolean;
  onClose: () => void;
  employee: any;
  sessionList: Customer[];
  employeeCustomers: string[];
  onSave: () => void;
  loading: boolean;
  customerTab: string;
  setCustomerTab: (tab: string) => void;
  selectedLeft: string[];
  setSelectedLeft: (ids: string[]) => void;
  selectedRight: string[];
  setSelectedRight: (ids: string[]) => void;
  moveToRight: () => void;
  moveToLeft: () => void;
  leftList: Customer[];
  rightList: Customer[];
}

const EmployeeCustomerModal: React.FC<EmployeeCustomerModalProps> = ({
  open,
  onClose,
  employee,
  sessionList,
  employeeCustomers,
  onSave,
  loading,
  customerTab,
  setCustomerTab,
  selectedLeft,
  setSelectedLeft,
  selectedRight,
  setSelectedRight,
  moveToRight,
  moveToLeft,
  leftList,
  rightList,
}) => {
  return (
    <Modal
      title={null}
      open={open}
      footer={null}
      onCancel={onClose}
      width={680}
      style={{ top: 60 }}
      styles={{
        body: {
          borderRadius: 8,
          background: "#F4F4F4",
          padding: 24,
          height: 500,
          display: "flex",
          flexDirection: "column",
        },
      }}
      closable={false}
    >
      {loading ? (
        <SkeletonList />
      ) : (
        <>
          <div style={{ fontSize: 20, fontWeight: 500, marginBottom: 24 }}>
            员工对接客户管理
          </div>
          <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
            {/* 左侧 */}
            <div
              style={{
                width: 220,
                display: "flex",
                flexDirection: "column",
                marginRight: 24,
                minHeight: 0,
              }}
            >
              <Tabs
                activeKey={customerTab}
                onChange={setCustomerTab}
                items={[
                  { key: "all", label: "全部客户" },
                  { key: "unassigned", label: "未分配客户" },
                ]}
                style={{ marginBottom: 8 }}
              />
              <div
                style={{
                  background: "#fff",
                  flex: 1,
                  borderRadius: 6,
                  overflow: "auto",
                  border: "1px solid #eee",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                }}
              >
                {/* 标题栏 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid #eee",
                    padding: "0 12px",
                    height: 40,
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  <Checkbox
                    checked={
                      selectedLeft.length === leftList.length &&
                      leftList.length > 0
                    }
                    indeterminate={
                      selectedLeft.length > 0 &&
                      selectedLeft.length < leftList.length
                    }
                    onChange={(e) =>
                      setSelectedLeft(
                        e.target.checked ? leftList.map((c) => c.id) : []
                      )
                    }
                    style={{ marginRight: 8 }}
                  />
                  <span style={{ flex: 1 }}>客户名称</span>
                  <span style={{ width: 60 }}>对接人</span>
                </div>
                {/* 客户项 */}
                <div style={{ flex: 1, overflow: "auto" }}>
                  {leftList.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #eee",
                        padding: "0 12px",
                        height: 40,
                      }}
                    >
                      <Checkbox
                        checked={selectedLeft.includes(c.id)}
                        onChange={(e) => {
                          setSelectedLeft(
                            e.target.checked
                              ? [...selectedLeft, c.id]
                              : selectedLeft.filter((id) => id !== c.id)
                          );
                        }}
                        style={{ marginRight: 8 }}
                      />
                      <span style={{ flex: 1 }}>{c.customerName}</span>
                      <span style={{ width: 60 }}>{c.employeeName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* 中间双箭头 */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: 16,
                width: 60,
              }}
            >
              <Button
                style={{
                  width: 36,
                  height: 36,
                  border: "1px solid #ccc",
                  background: "#fff",
                  color: "#000",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                icon={<DoubleRightOutlined />}
                disabled={selectedLeft.length === 0}
                onClick={moveToRight}
              />
              <Button
                style={{
                  width: 36,
                  height: 36,
                  border: "1px solid #ccc",
                  background: "#fff",
                  color: "#000",
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                icon={<DoubleLeftOutlined />}
                disabled={selectedRight.length === 0}
                onClick={moveToLeft}
              />
            </div>
            {/* 右侧 */}
            <div
              style={{
                width: 320,
                display: "flex",
                flexDirection: "column",
                minHeight: 0,
              }}
            >
              <div
                style={{
                  fontWeight: 500,
                  marginBottom: 8,
                  height: 24,
                  flexShrink: 0,
                }}
              >
                员工客户
              </div>
              <div
                style={{
                  background: "#fff",
                  flex: 1,
                  borderRadius: 6,
                  overflow: "auto",
                  border: "1px solid #eee",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 0,
                }}
              >
                {/* 标题栏 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderBottom: "1px solid #eee",
                    padding: "0 12px",
                    height: 40,
                    fontWeight: 500,
                    flexShrink: 0,
                  }}
                >
                  <Checkbox
                    checked={
                      selectedRight.length === rightList.length &&
                      rightList.length > 0
                    }
                    indeterminate={
                      selectedRight.length > 0 &&
                      selectedRight.length < rightList.length
                    }
                    onChange={(e) =>
                      setSelectedRight(
                        e.target.checked ? rightList.map((c) => c.id) : []
                      )
                    }
                    style={{ marginRight: 8 }}
                  />
                  <span style={{ flex: 1 }}>客户名称</span>
                </div>
                {/* 客户项 */}
                <div style={{ flex: 1, overflow: "auto" }}>
                  {rightList.map((c) => (
                    <div
                      key={c.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        borderBottom: "1px solid #eee",
                        padding: "0 12px",
                        height: 40,
                      }}
                    >
                      <Checkbox
                        checked={selectedRight.includes(c.id)}
                        onChange={(e) => {
                          setSelectedRight(
                            e.target.checked
                              ? [...selectedRight, c.id]
                              : selectedRight.filter((id) => id !== c.id)
                          );
                        }}
                        style={{ marginRight: 8 }}
                      />
                      <span style={{ flex: 1 }}>{c.customerName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* 底部按钮 */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 24,
            }}
          >
            <Button
              style={{
                background: "#fff",
                color: "#000",
                border: "1px solid #ccc",
              }}
              onClick={onClose}
            >
              取消
            </Button>
            <Button
              style={{ background: "#000", color: "#fff", border: "none" }}
              loading={loading}
              onClick={onSave}
            >
              保存
            </Button>
          </div>
        </>
      )}
    </Modal>
  );
};

export default EmployeeCustomerModal; 