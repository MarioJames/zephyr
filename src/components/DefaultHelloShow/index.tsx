import React from "react";
import { createStyles } from "antd-style";
import { HELLO_IMG } from "@/const/base";

const useStyles = createStyles(({ css, token }) => ({
  container: css`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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


const DefaultHelloShow = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <img alt="" className={styles.helloImg} src={HELLO_IMG} />
        开始会话
      </div>
      <div className={styles.middle}>
        输入客户发送的韩文内容，获取翻译和业务提示信息
        <br />
        输入中文并以&quot;员工消息&quot;发送，获得韩文翻译和业务提示信息
      </div>
    </div>
  );
};

export default DefaultHelloShow;
