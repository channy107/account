import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";

const HOST = process.env.HOST;
const REGION = process.env.NEXT_PUBLIC_AWS_REGION;
const accessKeyId = process.env.ACCESS_KEY_ID!;
const secretAccessKey = process.env.SECRET_ACCESS_KEY!;

const sesClient = new SESClient({
  region: REGION,
  credentials: { accessKeyId, secretAccessKey },
});

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const confirmLink = `${HOST}/new-password?token=${token}`;

  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Data: `<p><a href="${confirmLink}">여기</a>를 클릭하여 비밀번호 재설정을 완료해주세요.</p>`,
        },
      },
      Subject: {
        Data: "비밀번호를 재설정하기 위한 메일입니다.",
      },
    },
    Source: "no-replay@trivialcoding.com",
  };

  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log("Email sent! Message ID:", data.MessageId);
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${HOST}/new-verification?token=${token}`;

  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Html: {
          Data: `<p><a href="${confirmLink}">여기</a>를 클릭하여 회원가입을 완료해주세요.</p>`,
        },
      },
      Subject: {
        Data: "회원 가입을 위한 이메일입니다. 확인해주세요.",
      },
    },
    Source: "no-replay@trivialcoding.com",
  };

  try {
    const data = await sesClient.send(new SendEmailCommand(params));
    console.log("Email sent! Message ID:", data.MessageId);
  } catch (error) {
    console.error(error);
    throw new Error();
  }
};
