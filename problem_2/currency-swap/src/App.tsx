import { Container, Typography, Box } from "@mui/material";
import SwapForm from "./components/swap-form";

export default function App() {
  return (
    <Container
      maxWidth="md"
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Box
        component="section"
        sx={{
          p: 4,
          flex: 1,
        }}
        className="main-box"
      >
        <Typography
          variant="h3"
          align="center"
          color="primary.main"
          fontWeight={700}
          marginBottom={5}
        >
          Currency Swap
        </Typography>
        <SwapForm />
      </Box>
    </Container>
  );
}
