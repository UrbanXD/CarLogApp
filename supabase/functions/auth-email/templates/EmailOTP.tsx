import { Body, Container, Head, Html, Preview, Section, Text } from "npm:@react-email/components@0.0.32";
import * as React from "npm:react@18.3.1";

interface SignUpEmailProps {
    token: string
    title: string
    content: string
    footer: string
}

export const EmailOTP = ({
    token,
    title,
    content,
    footer
}: SignUpEmailProps) => {
    return (
        <Html >
            <Head/>
            <Preview>Hitelesítő kód: { token }</Preview>
            <Body style={ main }>
                <Container style={ container }>
                    <Text className style={ titleText }>
                        { title }
                    </Text>
                    <Text style={ text }>
                        { content }
                    </Text>
                    <Section style={ tokenContainer }>
                        <Text style={ tokenText }>
                            { token }
                        </Text>
                    </Section>
                    <Text style={ footerText }>
                        { footer }
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}

export default EmailOTP;

const main = {
    backgroundColor: "#242424",
    margin: "0 auto",
    height: "40vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
}

const container = {
    margin: "0 auto",
    padding: "0px 20px",
}

const titleText = {
    color: "#FFDF00",
    fontSize: "11px",
    fontWeight: 700,
    fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
    height: "16px",
    letterSpacing: 0,
    lineHeight: "16px",
    margin: "16px 8px 8px 8px",
    textTransform: "uppercase" as const,
    textAlign: "center" as const,
}

const text = {
    color: "#bdbdbd",
    display: "inline-block",
    fontFamily: "HelveticaNeue-Medium,Helvetica,Arial,sans-serif",
    fontSize: "20px",
    fontWeight: 500,
    lineHeight: "24px",
    marginBottom: 0,
    marginTop: 0,
    textAlign: "center" as const,
}

const tokenContainer = {
    background: "rgba(189, 189, 189, 0.3)",
    borderRadius: "4px",
    margin: "16px auto 14px",
    verticalAlign: "middle",
    width: "280px",
};

const tokenText = {
    color: "#fdfdfd",
    display: "inline-block",
    fontFamily: "HelveticaNeue-Bold",
    fontSize: "32px",
    fontWeight: 700,
    letterSpacing: "6px",
    lineHeight: "40px",
    paddingBottom: "8px",
    paddingTop: "8px",
    margin: "0 auto",
    width: "100%",
    textAlign: "center" as const,
};

const footerText = {
    color: "#8a8a8a",
    fontSize: "10px",
    fontFamily: "HelveticaNeue,Helvetica,Arial,sans-serif",
    letterSpacing: "0",
    lineHeight: "18px",
    padding: "0 35px",
    margin: 0,
    textAlign: "center" as const,
}