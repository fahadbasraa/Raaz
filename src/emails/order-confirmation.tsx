import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Text,
} from "@react-email/components";

type OrderConfirmationEmailProps = {
  orderNumber: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  shippingAddress: {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
};

function formatPrice(cents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default function OrderConfirmationEmail({
  orderNumber,
  items,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your RAAZ order has been kept — #{orderNumber}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={wordmark}>RAAZ</Text>
          <Heading style={heading}>Kept.</Heading>
          <Text style={paragraph}>
            Your order has been received and payment confirmed. Order{" "}
            <strong>#{orderNumber}</strong> is now with the atelier.
          </Text>

          <Hr style={hr} />

          {items.map((item, i) => (
            <Row key={i} style={itemRow}>
              <Column>
                <Text style={itemName}>
                  {item.name} × {item.quantity}
                </Text>
              </Column>
              <Column align="right">
                <Text style={itemPrice}>
                  {formatPrice(item.price * item.quantity)}
                </Text>
              </Column>
            </Row>
          ))}

          <Hr style={hr} />

          <Row>
            <Column>
              <Text style={totalLabel}>Total</Text>
            </Column>
            <Column align="right">
              <Text style={totalValue}>{formatPrice(total)}</Text>
            </Column>
          </Row>

          <Hr style={hr} />

          <Text style={label}>Shipping to</Text>
          <Text style={paragraph}>
            {shippingAddress.name}
            <br />
            {shippingAddress.line1}
            {shippingAddress.line2 ? <br /> : null}
            {shippingAddress.line2}
            <br />
            {shippingAddress.city}, {shippingAddress.state}{" "}
            {shippingAddress.postalCode}
            <br />
            {shippingAddress.country}
          </Text>

          <Text style={footer}>
            راز — secret. Kept quiet, worn loudly. Made slowly, in small
            numbers.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body: React.CSSProperties = {
  backgroundColor: "#ede7db",
  fontFamily: "Georgia, 'Times New Roman', serif",
  padding: "40px 0",
};

const container: React.CSSProperties = {
  backgroundColor: "#ffffff",
  maxWidth: "480px",
  margin: "0 auto",
  padding: "48px 40px",
};

const wordmark: React.CSSProperties = {
  fontStyle: "italic",
  fontSize: "20px",
  letterSpacing: "0.05em",
  color: "#15201b",
  margin: "0 0 32px",
};

const heading: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: 300,
  color: "#15201b",
  margin: "0 0 16px",
};

const paragraph: React.CSSProperties = {
  fontSize: "14px",
  lineHeight: "1.7",
  color: "#4a4a44",
};

const label: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  color: "#8b9089",
  margin: "0 0 8px",
};

const hr: React.CSSProperties = {
  borderColor: "#e5e0d3",
  margin: "24px 0",
};

const itemRow: React.CSSProperties = { marginBottom: "8px" };
const itemName: React.CSSProperties = { fontSize: "14px", color: "#15201b" };
const itemPrice: React.CSSProperties = { fontSize: "14px", color: "#4a4a44" };
const totalLabel: React.CSSProperties = {
  fontSize: "14px",
  color: "#15201b",
  fontWeight: 600,
};
const totalValue: React.CSSProperties = {
  fontSize: "14px",
  color: "#15201b",
  fontWeight: 600,
};
const footer: React.CSSProperties = {
  fontSize: "11px",
  color: "#8b9089",
  marginTop: "40px",
};
