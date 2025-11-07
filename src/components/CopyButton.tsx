/**
 * components/CopyButton.tsx — copies the current LaTeX payload with instant feedback.
 */
import { Button, useClipboard, useToast } from '@chakra-ui/react'
import { useEffect } from 'react'

interface CopyButtonProps {
  latex: string
}

const CopyButton = ({ latex }: CopyButtonProps) => {
  const toast = useToast()
  const { hasCopied, setValue, onCopy } = useClipboard(latex)

  useEffect(() => {
    setValue(latex)
  }, [latex, setValue])

  const handleCopy = () => {
    if (!latex.trim()) {
      toast({
        title: 'LaTeXがまだ生成されていません',
        status: 'info',
        duration: 2500,
        isClosable: true,
      })
      return
    }

    onCopy()
    toast({
      title: 'LaTeXをコピーしました',
      status: 'success',
      duration: 2000,
    })
  }

  return (
    <Button
      variant="outline"
      onClick={handleCopy}
      width={{ base: 'full', md: 'auto' }}
      minW={{ md: '120px' }}
    >
      {hasCopied ? 'Copied' : 'Copy LaTeX'}
    </Button>
  )
}

export default CopyButton
