/**
 * components/TableEditor.tsx — mounts the Luckysheet canvas with sane defaults.
 */
import {
  Box,
  Center,
  Spinner,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

import useTableStore from '@/hooks/useTableStore'
import { TABLE_CONFIG } from '@/config/config'
import { buildDefaultSheet } from '@/utils/sheetTemplates'
import { loadLuckysheet, teardownLuckysheet } from '@/utils/luckysheetClient'

import 'luckysheet/dist/css/luckysheet.css'
import 'luckysheet/dist/plugins/css/pluginsCss.css'
import 'luckysheet/dist/plugins/plugins.css'
import 'luckysheet/dist/assets/iconfont/iconfont.css'

const TableEditor = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rebuildVersion = useTableStore((state) => state.rebuildVersion)
  const [isBooting, setIsBooting] = useState(true)
  const toast = useToast()
  const canvasBg = useColorModeValue('white', 'gray.800')
  const editorMinH = useBreakpointValue({ base: '60vh', md: '70vh', lg: '75vh' }) ?? '70vh'

  useEffect(() => {
    setIsBooting(true)
    let isCancelled = false
    const container = containerRef.current

    if (!container) {
      setIsBooting(false)
      return
    }

    const bootstrap = async () => {
      try {
        const luckysheet = await loadLuckysheet()
        if (isCancelled) {
          return
        }

        const containerId = `luckysheet-root-${rebuildVersion}`
        container.id = containerId

        luckysheet.destroy?.()
        luckysheet.create({
          container: containerId,
          lang: 'en',
          title: 'table2table',
          showinfobar: false,
          showsheetbar: true,
          showtoolbar: true,
          sheetFormulaBar: true,
          enableAddRow: false,
          enableAddCol: false,
          row: TABLE_CONFIG.initialRows,
          column: TABLE_CONFIG.initialColumns,
          data: [buildDefaultSheet()],
          allowEdit: true,
          userInfo: false,
          showsort: true,
          allowUpdate: true,
          forceCalculation: false,
          celldata: [],
        })

      } catch (error) {
        console.error('Luckysheet init failed', error)
        toast({
          title: 'Luckysheet初期化エラー',
          description: error instanceof Error ? error.message : 'ブラウザコンソールを確認してください。',
          status: 'error',
          isClosable: true,
        })
      } finally {
        if (!isCancelled) {
          setIsBooting(false)
        }
      }
    }

    bootstrap()

    return () => {
      isCancelled = true
      teardownLuckysheet()
    }
  }, [rebuildVersion, toast])

  return (
    <Box
      position="relative"
      borderWidth="1px"
      borderRadius="lg"
      bg={canvasBg}
      minH={editorMinH}
      overflow="hidden"
      width="100%"
    >
      <Box ref={containerRef} minH={editorMinH} width="100%" />
      {isBooting && (
        <Center position="absolute" inset={0} bg="blackAlpha.200" _dark={{ bg: 'blackAlpha.500' }}>
          <Spinner mr={2} />
          <Text fontWeight="medium">Luckysheet を初期化しています…</Text>
        </Center>
      )}
    </Box>
  )
}

export default TableEditor
