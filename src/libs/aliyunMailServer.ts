// 服务器端专用的邮件服务
import nodemailer from 'nodemailer';
import type {
  AliyunMailConfig,
  AliyunSMTPConfig,
  MailOptions,
  MailResponse,
} from '@/types/mail';
import { mailEnv } from '@/env/mail';

export class AliyunMailServerService {
  private config: AliyunMailConfig;
  private transporter?: nodemailer.Transporter;

  constructor(config: AliyunMailConfig) {
    this.config = config;
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (this.config.smtp) {
      this.transporter = nodemailer.createTransport({
        host: this.config.smtp.host,
        port: this.config.smtp.port,
        secure: this.config.smtp.secure || false,
        auth: {
          user: this.config.smtp.auth.user,
          pass: this.config.smtp.auth.pass,
        },
        // 添加超时配置
        connectionTimeout: 10_000, // 10秒连接超时
        greetingTimeout: 5000,   // 5秒握手超时
        socketTimeout: 15_000,    // 15秒套接字超时
      });
    }
  }

  async sendMail(options: MailOptions): Promise<MailResponse> {
    try {
      if (!this.transporter) {
        throw new Error('邮件传输器未初始化，请检查 SMTP 配置');
      }

      const mailOptions = {
        from: options.from || this.config.smtp?.auth.user,
        to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
        cc: options.cc
          ? Array.isArray(options.cc)
            ? options.cc.join(', ')
            : options.cc
          : undefined,
        bcc: options.bcc
          ? Array.isArray(options.bcc)
            ? options.bcc.join(', ')
            : options.bcc
          : undefined,
        subject: options.subject,
        text: options.text,
        html: options.html,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions as any);

      return {
        success: true,
        messageId: info.messageId,
        response: info.response,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '发送邮件失败',
      };
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      if (!this.transporter) {
        return false;
      }
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('邮件服务连接验证失败:', error);
      return false;
    }
  }

  static createFromEnv(): AliyunMailServerService {
    const smtpConfig = {
      host: mailEnv.ALIYUN_MAIL_SMTP_HOST || 'smtpdm.aliyun.com',
      port: parseInt(mailEnv.ALIYUN_MAIL_SMTP_PORT || '25'),
      secure: mailEnv.ALIYUN_MAIL_SMTP_SECURE,
      auth: {
        user: mailEnv.ALIYUN_MAIL_SMTP_USER,
        pass: mailEnv.ALIYUN_MAIL_SMTP_PASS,
      },
    };

    const config: AliyunMailConfig = {};

    // 检查必需的 SMTP 配置
    if (smtpConfig.auth.user && smtpConfig.auth.pass) {
      config.smtp = smtpConfig as AliyunSMTPConfig;
    } else {
      console.warn('邮件服务配置不完整：缺少 ALIYUN_MAIL_SMTP_USER 或 ALIYUN_MAIL_SMTP_PASS');
    }

    return new AliyunMailServerService(config);
  }
}
