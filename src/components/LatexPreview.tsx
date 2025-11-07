/**
 * components/LatexPreview.tsx — presents the generated LaTeX plus helpful tips.
 */
import { Badge, Box, Code, Stack, Text, Textarea } from '@chakra-ui/react'
import { useMemo } from 'react'

import useTableStore from '@/hooks/useTableStore'

const formatTimestamp = (timestamp?: number) => {
  if (!timestamp) {
    return '未生成'
  }

  return new Intl.DateTimeFormat('ja-JP', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(timestamp)
}

const LatexPreview = () => {
  const latex = useTableStore((state) => state.latex)
  const environment = useTableStore((state) => state.environment)
  const columnAlignment = useTableStore((state) => state.columnAlignment)
  const lastGeneratedAt = useTableStore((state) => state.lastGeneratedAt)

  const statusLabel = useMemo(() => formatTimestamp(lastGeneratedAt), [lastGeneratedAt])

  return (
    <Stack spacing={3} borderWidth="1px" borderRadius="lg" p={4} bg="white" _dark={{ bg: 'gray.800' }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Text fontWeight="semibold">LaTeX Preview</Text>
        <Badge colorScheme="purple" textTransform="none">
          {environment}
        </Badge>
      </Box>
      <Textarea
        value={latex}
        placeholder={'Generate LaTeX を押すとここに出力されます'}
        isReadOnly
        minH="360px"
        fontFamily="mono"
        color="gray.800"
        bg="gray.50"
        _dark={{ color: 'gray.100', bg: 'gray.900' }}
      />
      <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
        Alignment: <Code>{columnAlignment}</Code> ／ 最終更新: {statusLabel}
      </Text>
      <Text fontSize="sm" color="gray.500" _dark={{ color: 'gray.400' }}>
        multirow / multicolumn を使う場合は <Code>{'\\usepackage{multirow}'}</Code>{' '}
        を preamble に追加してください。
      </Text>
    </Stack>
  )
}

export default LatexPreview
