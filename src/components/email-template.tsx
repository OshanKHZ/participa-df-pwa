import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
} from '@react-email/components'

interface EmailTemplateProps {
  code: string
}

export const EmailTemplate = ({ code }: EmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Seu código de acesso ao Participa DF</Preview>
    <Tailwind>
      <Body className="bg-white my-auto mx-auto font-sans">
        <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px]">
          <Section className="mt-[32px]">
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              <strong>Participa DF</strong>
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">Olá,</Text>
            <Text className="text-black text-[14px] leading-[24px]">
              Seu código de verificação para acessar o{' '}
              <strong>Participa DF</strong> é:
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Text className="bg-zinc-100 rounded text-black text-[32px] font-bold tracking-[8px] py-[16px]">
                {code}
              </Text>
            </Section>
            <Text className="text-black text-[14px] leading-[24px]">
              Este código irá expirar em 15 minutos.
            </Text>
            <Text className="text-[#666666] text-[12px] leading-[24px] mt-[32px]">
              Se você não solicitou este código, por favor ignore este email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
)

export default EmailTemplate
