import { useMediaQuery } from "react-responsive";
import { styled } from "baseui";

// Define your breakpoints
const breakpoints = {
  mobile: "(max-width: 767px)",
  tablet: "(min-width: 768px) and (max-width: 1023px)",
  desktop: "(min-width: 1024px)",
};

// Styled container
const Container = styled("div", {
  marginLeft: "auto",
  marginRight: "auto",
  width: "auto",
  maxWidth: "100%",
  padding: "1rem",
});

export default function ResponsiveContainer({ children }) {
  const isDesktop = useMediaQuery({ query: breakpoints.desktop });
  const isTablet = useMediaQuery({ query: breakpoints.tablet });
  const isMobile = useMediaQuery({ query: breakpoints.mobile });

  let width;

  if (isDesktop) {
    width = "1024px"; // desktop content width
  } else if (isTablet) {
    width = "100%"; // tablet content width
  } else if (isMobile) {
    width = "100%"; // mobile content width
  }

  return (
    <Container
      style={{
        maxWidth: width,
      }}
    >
      {children}
    </Container>
  );
}
