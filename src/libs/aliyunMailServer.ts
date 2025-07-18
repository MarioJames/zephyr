// 服务器端专用的邮件服务
import nodemailer from 'nodemailer';
import type { AliyunMailConfig, MailOptions, MailResponse } from '@/types/mail';

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

      const info = await this.transporter.sendMail(mailOptions);

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
      host: process.env.ALIYUN_MAIL_SMTP_HOST || 'smtpdm.aliyun.com',
      port: parseInt(process.env.ALIYUN_MAIL_SMTP_PORT || '25'),
      secure: process.env.ALIYUN_MAIL_SMTP_SECURE === 'true',
      auth: {
        user: process.env.ALIYUN_MAIL_SMTP_USER || '',
        pass: process.env.ALIYUN_MAIL_SMTP_PASS || '',
      },
    };

    const config: AliyunMailConfig = {};

    if (smtpConfig.auth.user && smtpConfig.auth.pass) {
      config.smtp = smtpConfig;
    }

    return new AliyunMailServerService(config);
  }
}
