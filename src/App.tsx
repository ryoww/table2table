/**
 * App.tsx — high-level layout that stitches together the editor and preview panes.
 */
import {
  Box,
  Container,
  Heading,
  Icon,
  IconButton,
  Stack,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";

import LatexPreview from "@/components/LatexPreview";
import TableEditor from "@/components/TableEditor";
import Toolbar from "@/components/Toolbar";
import { UI_COPY, UI_DIMENSIONS } from "@/config/config";

const App = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box minH="100vh" py={{ base: 4, md: 8 }}>
      <Container maxW={{ base: "full", xl: "6xl" }} px={{ base: 4, md: 6 }}>
        <Stack spacing={{ base: 6, md: 8 }}>
          <Stack
            direction={{ base: "row", md: "row" }}
            align="center"
            justify="space-between"
            w="100%"
          >
            <Box textAlign={{ base: "left", md: "left" }}>
              <Heading size="lg">{UI_COPY.title}</Heading>
              <Text
                color="gray.600"
                _dark={{ color: "gray.300" }}
                fontSize={{ base: "sm", md: "md" }}
              >
                {UI_COPY.tagline}
              </Text>
            </Box>
            <IconButton
              aria-label="Toggle color mode"
              onClick={toggleColorMode}
              variant="outline"
              mt={{ base: 2, md: 0 }}
              size={{ base: "md", md: "md" }}
              icon={
                <Icon
                  as={colorMode === "light" ? FiMoon : FiSun}
                  boxSize={UI_DIMENSIONS.colorModeToggleIcon}
                />
              }
            />
          </Stack>

          <Stack spacing={4}>
            <Toolbar />
            <TableEditor />
          </Stack>

          <LatexPreview />
        </Stack>
      </Container>
    </Box>
  );
};

export default App;
