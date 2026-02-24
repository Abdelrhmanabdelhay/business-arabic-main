import nodemailer from 'nodemailer'
import path from 'path';
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendContactEmail = async (
  name: string,
  email: string,
  message: string
) => {
  try {
const info = await transporter.sendMail({
  from: `"Business Arabic" <${process.env.RECEIVER_EMAIL}>`,
  to: process.env.RECEIVER_EMAIL, // admin email
  replyTo: email, // user email, so admin can reply directly
  subject: `Refund Request from ${name}`,
  html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Refund Request</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f1f5f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">

          <!-- ══ TOP LABEL ══ -->
          <tr>
            <td align="center" style="padding-bottom:16px;">
              <span style="display:inline-block;background-color:#fef2f2;border:1px solid #fecaca;color:#dc2626;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:6px 16px;border-radius:30px;">
                ● Action Required
              </span>
            </td>
          </tr>

          <!-- ══ CARD ══ -->
          <tr>
            <td style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.08);">

              <!-- HEADER GRADIENT -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 60%,#0f2d52 100%);padding:36px 40px;position:relative;">
                    
                    <!-- Logo + Title row -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="64" style="vertical-align:middle;">
                          <img src="cid:businessLogo" alt="Business Arabic Logo"
                            style="width:56px;height:56px;border-radius:14px;border:2px solid rgba(255,255,255,0.2);object-fit:cover;display:block;" />
                        </td>
                        <td style="vertical-align:middle;padding-left:16px;">
                          <p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;color:rgba(255,255,255,0.45);">
                            Business Arabic
                          </p>
                          <h1 style="margin:0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.25;">
                            New Refund Request
                          </h1>
                        </td>
                      </tr>
                    </table>

                    <!-- Status pill -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;">
                      <tr>
                        <td style="background:rgba(239,68,68,0.18);border:1px solid rgba(239,68,68,0.4);border-radius:30px;padding:7px 16px;">
                          <span style="font-size:12px;font-weight:600;color:#fca5a5;letter-spacing:0.5px;">
                            ⚠&nbsp;&nbsp;Pending Review
                          </span>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

              <!-- DIVIDER STRIP -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td height="4" style="background:linear-gradient(90deg,#ef4444,#f97316,#eab308);"></td>
                </tr>
              </table>

              <!-- BODY -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:36px 40px;">

                    <!-- Intro text -->
                    <p style="margin:0 0 28px;font-size:15px;color:#475569;line-height:1.7;">
                      A user has submitted a refund request through the platform. 
                      Please review the details below and take the appropriate action.
                    </p>

                    <!-- ── USER INFO CARDS ── -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:24px;">
                      <tr>
                        <!-- Name card -->
                        <td width="48%" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 18px;vertical-align:top;">
                          <p style="margin:0 0 5px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#94a3b8;">
                            Full Name
                          </p>
                          <p style="margin:0;font-size:15px;font-weight:600;color:#0f172a;">
                            ${name}
                          </p>
                        </td>
                        <td width="4%"></td>
                        <!-- Email card -->
                        <td width="48%" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:16px 18px;vertical-align:top;">
                          <p style="margin:0 0 5px;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#94a3b8;">
                            Email Address
                          </p>
                          <p style="margin:0;font-size:14px;font-weight:600;color:#2563eb;word-break:break-all;">
                            ${email}
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- ── REASON BOX ── -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="background:#fffbeb;border:1px solid #fde68a;border-radius:14px;padding:22px 24px;">

                          <!-- Label row -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:14px;">
                            <tr>
                              <td>
                                <table cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="background:#f59e0b;border-radius:6px;width:4px;height:20px;"></td>
                                    <td style="padding-left:10px;">
                                      <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:#92400e;">
                                        Reason for Refund
                                      </p>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>

                          <!-- Message bubble -->
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="background:#ffffff;border:1px solid #fcd34d;border-radius:10px;padding:16px 18px;">
                                <p style="margin:0;font-size:14px;color:#44403c;line-height:1.75;">
                                  ${message}
                                </p>
                              </td>
                            </tr>
                          </table>

                        </td>
                      </tr>
                    </table>

                    <!-- ── REPLY CTA ── -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                      <tr>
                        <td style="background:linear-gradient(135deg,#eff6ff,#dbeafe);border:1px solid #bfdbfe;border-radius:14px;padding:20px 24px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="vertical-align:middle;">
                                <p style="margin:0 0 3px;font-size:13px;font-weight:700;color:#1e40af;">
                                  💬 Reply Directly to the User
                                </p>
                                <p style="margin:0;font-size:13px;color:#3b82f6;line-height:1.5;">
                                  Hit <strong>Reply</strong> in your email client — it goes straight to
                                  <span style="font-weight:700;">${email}</span>
                                </p>
                              </td>
                              <td style="vertical-align:middle;padding-left:16px;" width="100">
                                <a href="mailto:${email}"
                                  style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#ffffff;font-size:12px;font-weight:700;text-decoration:none;padding:10px 18px;border-radius:8px;letter-spacing:0.3px;white-space:nowrap;">
                                  Reply Now →
                                </a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- ── TIMESTAMP ── -->
                    <p style="margin:0;font-size:12px;color:#cbd5e1;text-align:center;">
                      Received on ${new Date().toLocaleDateString("en-US", { weekday:"long", year:"numeric", month:"long", day:"numeric" })}
                      &nbsp;·&nbsp;
                      ${new Date().toLocaleTimeString("en-US", { hour:"2-digit", minute:"2-digit", timeZoneName:"short" })}
                    </p>

                  </td>
                </tr>
              </table>

              <!-- ══ FOOTER ══ -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:#0f172a;padding:24px 40px;border-radius:0 0 20px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <p style="margin:0;font-size:13px;font-weight:700;color:#ffffff;">Business Arabic</p>
                          <p style="margin:4px 0 0;font-size:12px;color:#64748b;">
                            This is an automated notification — do not reply to this address.
                          </p>
                        </td>
                        <td align="right">
                          <span style="display:inline-block;background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.3);border-radius:6px;padding:5px 12px;font-size:11px;font-weight:700;color:#f87171;letter-spacing:1px;text-transform:uppercase;">
                            Refund
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
  `,
  attachments: [
    {
      filename: 'logo.png',
      path: path.join(__dirname, "../assets/logo.png"),
      cid: 'businessLogo' 
    }
  ]
});
    return { success: true };
  } catch (error) {
    return { success: false };
  }
};

