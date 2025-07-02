import React from "react";
import { createStyles } from "antd-style";
import { HELLO_IMG } from "@/const/base";

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    box-sizing: border-box;
  `,
  helloImg: css`
    width: 40px;
    height: 40px;
    margin-right: 16px;
  `,
  top: css`
    font-size: 32px;
    font-weight: 600;
    color: ${token.colorText};
    margin-bottom: 16px;
    text-align: center;
  `,
  middle: css`
    font-size: 14px;
    color: ${token.colorTextSecondary};
    margin-bottom: 32px;
    text-align: center;
  `
}));


const DefaultCreateCustomer = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <img src={HELLO_IMG} alt="" className={styles.helloImg} />
        开始会话
      </div>
      <div className={styles.middle}>
        输入客户发送的韩文内容，获取翻译和业务提示信息
        <br />
        输入中文并以“员工消息”发送，获得韩文翻译和业务提示信息
      </div>
    </div>
  );
};

export default DefaultCreateCustomer;
