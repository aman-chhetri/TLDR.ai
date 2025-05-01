import { useState } from 'react'
import {
  Box,
  Textarea,
  Button,
  VStack,
  Text,
  useToast,
  Spinner,
} from '@chakra-ui/react'
import axios from 'axios'

const TextSummarizer = () => {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const handleSummarize = async () => {
    if (!text.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some text to summarize',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-r1-zero:free',
          messages: [
            {
              role: 'user',
              content: `Please summarize the following text in a concise way: ${text}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          },
        }
      )
      const rawSummary = response.data.choices[0].message.content
      const cleanedSummary = rawSummary
        .replace(/\\boxed\{\s*"/g, '')
        .replace(/"\s*\}/g, '')
        .replace(/\\boxed\{/g, '')
        .replace(/\}/g, '')
        .replace(/^"/, '')
        .replace(/"$/, '')
        .trim()
      setSummary(cleanedSummary)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate summary. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack spacing={6} w="full">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your text here..."
        size="lg"
        minH="200px"
        resize="vertical"
      />
      <Button
        colorScheme="blue"
        onClick={handleSummarize}
        isLoading={isLoading}
        loadingText="Summarizing..."
        w="full"
      >
        Summarize Text
      </Button>
      {summary && (
        <Box w="full" p={4} borderWidth={1} borderRadius="md">
          <Text fontWeight="bold" mb={2}>
            Summary:
          </Text>
          <Text>{summary}</Text>
        </Box>
      )}
    </VStack>
  )
}

export default TextSummarizer 