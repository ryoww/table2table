/**
 * components/Toolbar.tsx — action bar for generating, copying, and resetting tables.
 */
import {
  Button,
  Flex,
  HStack,
  Select,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useCallback } from "react";

import useTableStore from "@/hooks/useTableStore";
import type { TableEnvironment } from "@/types/luckysheet";
import { convertSheetsToLatex } from "@/utils/latexConverter";
import {
  loadLuckysheet,
  readSheets,
  teardownLuckysheet,
} from "@/utils/luckysheetClient";

import CopyButton from "./CopyButton";

const Toolbar = () => {
  const latex = useTableStore((state) => state.latex);
  const environment = useTableStore((state) => state.environment);
  const columnAlignment = useTableStore((state) => state.columnAlignment);
  const isGenerating = useTableStore((state) => state.isGenerating);
  const setLatex = useTableStore((state) => state.setLatex);
  const setEnvironment = useTableStore((state) => state.setEnvironment);
  const setColumnAlignment = useTableStore((state) => state.setColumnAlignment);
  const setIsGenerating = useTableStore((state) => state.setIsGenerating);
  const markGenerated = useTableStore((state) => state.markGenerated);
  const bumpRebuild = useTableStore((state) => state.bumpRebuild);
  const toast = useToast();

  const generateLatex = useCallback(async () => {
    setIsGenerating(true);
    try {
      await loadLuckysheet();
      const sheets = readSheets();
      if (!sheets.length) {
        throw new Error("シートデータが取得できませんでした");
      }
      const latexPayload = convertSheetsToLatex(sheets, {
        environment,
        columnAlignment,
      });
      setLatex(latexPayload);
      markGenerated();
      toast({
        title: "LaTeX を生成しました",
        status: "success",
        duration: 2200,
      });
    } catch (error) {
      console.error("generateLatex failed", error);
      toast({
        title: "LaTeX生成に失敗しました",
        description:
          error instanceof Error
            ? error.message
            : "詳細はコンソールを確認してください",
        status: "error",
        duration: 3200,
      });
    } finally {
      setIsGenerating(false);
    }
  }, [
    columnAlignment,
    environment,
    markGenerated,
    setIsGenerating,
    setLatex,
    toast,
  ]);

  const handleReset = () => {
    bumpRebuild();
    setLatex("");
    teardownLuckysheet();
    toast({
      title: "シートを初期状態に戻しました",
      status: "info",
      duration: 2000,
    });
  };

  return (
    <Stack
      direction={{ base: "column", lg: "row" }}
      spacing={4}
      borderWidth="1px"
      borderRadius="lg"
      p={{ base: 3, md: 4 }}
      bg="white"
      _dark={{ bg: "gray.800" }}
      width="100%"
      align="stretch"
    >
      <Stack
        spacing={3}
        flex={{ base: "1 1 auto", lg: "0 0 auto" }}
        w={{ base: "100%", lg: "420px" }}
        justify="space-between"
      >
        <Stack spacing={1}>
          <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
            LaTeX Environment
          </Text>
          <Select
            value={environment}
            size="sm"
            w="full"
            minW="200px"
            onChange={(event) =>
              setEnvironment(event.target.value as TableEnvironment)
            }
          >
            <option value="tabular">tabular</option>
            <option value="tabularx">tabularx</option>
          </Select>
        </Stack>
        <Stack spacing={1}>
          <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }}>
            Column Alignment
          </Text>
          <Select
            value={columnAlignment}
            size="sm"
            w="full"
            minW="200px"
            onChange={(event) => setColumnAlignment(event.target.value)}
          >
            <option value="c">center (c)</option>
            <option value="l">left (l)</option>
            <option value="r">right (r)</option>
            <option value="X">tabularx (X)</option>
          </Select>
        </Stack>
      </Stack>
      <Flex
        flex="1"
        direction="column"
        justify={{ base: "flex-start", lg: "flex-end" }}
        align={{ base: "stretch", lg: "flex-end" }}
      >
        <HStack
          spacing={3}
          flexWrap="wrap"
          justify="flex-end"
          align={{ base: "stretch", lg: "center" }}
        >
          <Button
            onClick={generateLatex}
            isLoading={isGenerating}
            loadingText="Generating"
            width={{ base: "full", md: "auto" }}
          >
            Generate LaTeX
          </Button>
          <CopyButton latex={latex} />
          <Button
            onClick={handleReset}
            variant="ghost"
            width={{ base: "full", md: "auto" }}
          >
            Reset Sheet
          </Button>
        </HStack>
      </Flex>
    </Stack>
  );
};

export default Toolbar;
