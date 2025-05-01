import { useState, useEffect, useRef } from "react";
import { FaCopy, FaDownload, FaMoon, FaSun, FaUpload, FaFileAlt, FaRedo, FaMagic, FaTwitter, FaGithub, FaLinkedin, FaWindowMaximize } from "react-icons/fa";
import Loader from "./components/Loader";
import Logo from "./components/Logo";
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import {
  Box, Flex, Button, IconButton, Textarea, Heading, Text, useColorMode, useColorModeValue, Input, Stack, useToast, Spacer, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon, Divider
} from '@chakra-ui/react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { FaChrome } from "react-icons/fa6";

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString();

const key = import.meta.env.VITE_OPENROUTER_API_KEY;

function About() {
  return (
    <Box pt={15} pb={10} textAlign="center" maxW="3xl" mx="auto">
      <Heading as="h1" size="2xl" mb={4} color={useColorModeValue('gray.800', 'white')}>About TLDR.ai</Heading>
      <Text fontSize="lg" color={useColorModeValue('gray.500', 'gray.300')} mb={8}>
        <b>TLDR.ai</b> is a modern, AI-powered text summarization tool. Effortlessly condense long articles, blogs, research papers, or documents into concise, easy-to-read summaries. Whether you paste text or upload files, TLDR.ai helps you save time and focus on what matters most.
      </Text>
      <Box textAlign="left" bg={useColorModeValue('brand.50', 'brand.700')} borderRadius="lg" p={6} mb={6} boxShadow="md">
        <Heading as="h2" size="md" mb={3} color={useColorModeValue('gray.700', 'gray.200')}>Key Features</Heading>
        <ul style={{ marginLeft: '1.5em', color: useColorModeValue('#444', '#e0e3ea') }}>
          <li>✨ <b>AI Summarization</b>: Get concise summaries of any text using advanced AI models via the OpenRouter API powered by the <b>(DeepSeek-R1-Zero)</b> model.</li>
          <li>📄 <b>File Upload</b>: Supports .txt, .pdf, and .docx files. Extracts and summarizes content from your documents.</li>
          <li>🌓 <b>Dark/Light Mode</b>: Toggle between beautiful dark and light themes for comfortable reading.</li>
          <li>📱 <b>Responsive Design</b>: Enjoy a seamless experience on desktop, tablet, or mobile.</li>
          <li>🔄 <b>Reset & Actions</b>: Easily clear your input, copy, or download your summary with a click.</li>
          <li>🔢 <b>Character Counter</b>: Stay within the 10,000 character limit with a live counter.</li>
        </ul>
      </Box>
      <Box textAlign="left" bg={useColorModeValue('brand.50', 'brand.700')} borderRadius="lg" p={6} boxShadow="md">
        <Heading as="h2" size="md" mb={3} color={useColorModeValue('gray.700', 'gray.200')}>Tech Stack</Heading>
        <ul style={{ marginLeft: '1.5em', color: useColorModeValue('#444', '#e0e3ea') }}>
          <li>⚛️ <b>React</b> (with Vite) for a fast, modern frontend</li>
          <li>💅 <b>Chakra UI</b> for accessible, beautiful components and theming</li>
          <li>🧠 <b>OpenRouter API</b> for state-of-the-art AI summarization (using <b>DeepSeek (deepseek-r1-zero:free)</b> model)</li>
          <li>📦 <b>pdfjs-dist</b> and <b>mammoth</b> for PDF and DOCX parsing in the browser</li>
          <li>🌐 <b>react-router-dom</b> for smooth navigation</li>
        </ul>
      </Box>
    </Box>
  );
}

function Home(props) {
  const [summary, setSummary] = useState("");
  const [pending, setPending] = useState(false);
  const [fileName, setFileName] = useState("");
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const MAX_CHARS = 10000;

  const extractTextFromPDF = async (arrayBuffer) => {
    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        text += strings.join(' ') + '\n';
      }
      return text;
    } catch (error) {
      throw error;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setPending(true);
    try {
      let text = "";
      const fileType = file.name.split('.').pop().toLowerCase();
      if (fileType === 'txt') {
        text = await file.text();
      } else if (fileType === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        text = await extractTextFromPDF(arrayBuffer);
      } else if (fileType === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        toast({ status: 'error', title: 'Unsupported file type', description: 'Please upload .txt, .pdf, or .docx files.' });
        return;
      }
      if (textareaRef.current) {
        textareaRef.current.value = text;
      }
    } catch (error) {
      toast({ status: 'error', title: 'Error reading file', description: error.message });
    } finally {
      setPending(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const resetForm = () => {
    setSummary("");
    setFileName("");
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setCharCount(text.length);
    } else {
      e.target.value = text.slice(0, MAX_CHARS);
      setCharCount(MAX_CHARS);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");
    if (!text.trim()) {
      toast({ status: 'warning', title: 'No text', description: 'Please enter some text or upload a file!' });
      return;
    }
    if (text.trim().length < 50) {
      toast({ status: 'warning', title: 'Text too short', description: 'Please enter longer text!' });
      return;
    }
    const prompt = `Summarize the following text: ${text}`;
    setPending(true);
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1-zero:free",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const data = await response.json();
      const cleanedSummary = data.choices[0].message.content
        .replace(/\\boxed\{\s*"/g, '')
        .replace(/"\s*\}/g, '')
        .replace(/\\boxed\{/g, '')
        .replace(/\}/g, '')
        .replace(/^"/, '')
        .replace(/"$/, '')
        .replace(/^```/g, '')
        .replace(/```$/g, '')
        .replace(/^text\s*/g, '')
        .replace(/\s*text\s*$/g, '')
        .replace(/\s*text\s*/g, ' ')
        .trim();
      setSummary(cleanedSummary);
    } catch (error) {
      toast({ status: 'error', title: 'Failed to summarize', description: 'Check console for details.' });
    } finally {
      setPending(false);
    }
  }

  const formattedSummary = summary
    .split("\n")
    .map((p, index) => <Text key={index} mb={4}>{p}</Text>);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(summary);
      toast({ status: 'success', title: 'Copied to clipboard!' });
    } catch (err) {
      toast({ status: 'error', title: 'Failed to copy' });
    }
  }

  function downloadText() {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Box pt={8} pb={6} textAlign="center">
        <Heading as="h1" size="2xl" mb={2} color={useColorModeValue('gray.800', 'white')}>Instant Summarization at Your FingerTips 👆</Heading>
        <Text fontSize="lg" color={useColorModeValue('gray.500', 'gray.300')}>"Too Long? Don't have Time? We Read It for You."</Text>
      </Box>
      <form onSubmit={handleSubmit}>
        <Flex className="content-wrapper" maxW="1200px" mx="auto" gap={6} align="stretch">
          {/* Input Column */}
          <Box flex={1} bg={useColorModeValue('brand.50', 'brand.700')} borderRadius="lg" boxShadow="md" p={6} display="flex" flexDirection="column" minHeight="480px" height="480px">
            <Heading as="h2" size="md" mb={4} color={useColorModeValue('#111', 'gray.200')} fontWeight="bold">Summarizer Tool ✨</Heading>
            <Textarea
              ref={textareaRef}
              name="text"
              required
              rows={12}
              height="300px"
              placeholder="Paste your article, blog, or document here..."
              onChange={handleTextChange}
              resize="none"
              mb={2}
              bg={useColorModeValue('brand.50', 'brand.700')}
              color={useColorModeValue('gray.800', 'gray.100')}
            />
            <Text fontSize="sm" color="gray.500" textAlign="right" mb={2}>{charCount}/{MAX_CHARS} characters</Text>
            <Flex align="center" mb={2}>
              <Input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.pdf,.docx"
                display="none"
              />
              <Button leftIcon={<FaUpload color={useColorModeValue('gray.800', 'white')} />} onClick={triggerFileInput} size="sm" colorScheme="gray" variant="outline" mr={2} borderColor="gray.400" color={useColorModeValue('gray.800', 'white')} _hover={{ borderColor: useColorModeValue('gray.600', 'gray.300'), color: useColorModeValue('gray.900', 'white'), bg: useColorModeValue('gray.200', 'whiteAlpha.100') }}>
                Upload File
              </Button>
              <Text fontSize="xs" color="gray.400">Supported file types: .txt, .pdf, .docx</Text>
            </Flex>
            {fileName && (
              <Flex align="center" fontSize="sm" color="gray.600" mb={2}>
                <Box as={FaFileAlt} mr={2} color="purple.400" /> {fileName}
              </Flex>
            )}
            <Box mt={8}>
              <Button
                type="button"
                onClick={resetForm}
                colorScheme="gray"
                variant="outline"
                size="sm"
                leftIcon={<FaRedo color="red.600" />}
                borderColor="red.400"
                color="red.600"
                _hover={{ borderColor: 'red.600', color: 'red.700', bg: 'red.50' }}
              >
                Clear
              </Button>
            </Box>
          </Box>

          {/* Output Column */}
          <Box flex={1} bg={useColorModeValue('brand.50', 'brand.700')} borderRadius="lg" boxShadow="md" p={6} display="flex" flexDirection="column" minHeight="480px" height="480px">
            <Heading as="h2" size="md" mb={4} color={useColorModeValue('gray.700', 'gray.200')}>Summarized Content 🔃</Heading>
            <Box bg={useColorModeValue('white', 'gray.800')} borderRadius="md" p={4} mb={4} overflowY="auto" height="300px">
              {pending ? <Loader /> : formattedSummary}
            </Box>
            <Flex gap={4} justify="center" mt={6}>
              <Button leftIcon={<FaCopy color={useColorModeValue('gray.800', 'white')} />} onClick={copyText} size="sm" colorScheme="gray" variant="outline" borderColor="gray.400" color={useColorModeValue('gray.800', 'white')} _hover={{ borderColor: useColorModeValue('gray.600', 'gray.300'), color: useColorModeValue('gray.900', 'white'), bg: useColorModeValue('gray.200', 'whiteAlpha.100') }} mr={2}>Copy</Button>
              <Button leftIcon={<FaDownload color={useColorModeValue('gray.800', 'white')} />} onClick={downloadText} size="sm" colorScheme="gray" variant="outline" borderColor="gray.400" color={useColorModeValue('gray.800', 'white')} _hover={{ borderColor: useColorModeValue('gray.600', 'gray.300'), color: useColorModeValue('gray.900', 'white'), bg: useColorModeValue('gray.200', 'whiteAlpha.100') }}>Download</Button>
            </Flex>
          </Box>
        </Flex>
        <Flex justify="center" mt={8}>
          <Button type="submit" isLoading={pending} colorScheme="blue" variant="solid" size="md" leftIcon={<FaMagic />} bg="blue.500" color="white" _hover={{ bg: 'blue.700', boxShadow: '0 0 0 3px #90cdf4', transform: 'scale(1.04)' }}>
            {pending ? "Summarizing..." : "Summarize"}
          </Button>
        </Flex>
      </form>
    </>
  );
}

function FAQ() {
  const faqs = [
    {
      q: 'What file types are supported?',
      a: 'You can upload .txt, .pdf, and .docx files for summarization.'
    },
    {
      q: 'Is my data stored?',
      a: 'No, your text and files are never stored. Summaries are generated in real-time using the OpenRouter API and are not saved.'
    },
    {
      q: 'How accurate are the summaries?',
      a: 'Summaries are generated by the DeepSeek-R1-Zero AI model. While generally accurate, always review the output for important details.'
    },
    {
      q: 'Is there a character limit?',
      a: 'Yes, the input is limited to 10,000 characters per summary.'
    },
    {
      q: 'Can I use this on mobile?',
      a: 'Yes! The app is fully responsive and works on all devices.'
    },
    {
      q: 'Can I summarize web pages or just files/text?',
      a: 'Currently, you can only summarize pasted text or uploaded files. Web page summarization is not supported yet.'
    },
    {
      q: 'What happens if I upload a very large file?',
      a: 'Only the first 10,000 characters will be processed due to the character limit.'
    },
    {
      q: 'What should I do if the summary seems off or incomplete?',
      a: 'Try rephrasing or shortening your input. AI summaries are generally accurate, but may occasionally miss context.'
    },
  ];
  return (
    <Box pt={15} pb={10} textAlign="center" maxW="3xl" mx="auto">
      <Heading as="h1" size="xl" mb={4} color={useColorModeValue('gray.800', 'white')}>Frequently Asked Questions❓</Heading>
      <Accordion allowToggle bg={useColorModeValue('brand.50', 'brand.700')} borderRadius="lg" p={6} boxShadow="md" textAlign="left">
        {faqs.map((faq, idx) => (
          <Box key={faq.q}>
            <AccordionItem border="none">
              <h2>
                <AccordionButton _expanded={{ bg: useColorModeValue('blue.50', 'blue.900'), color: 'blue.400' }}>
                  <Box flex="1" textAlign="left" fontWeight="bold">{faq.q}</Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4} color={useColorModeValue('gray.700', 'gray.200')}>
                {faq.a}
              </AccordionPanel>
            </AccordionItem>
            {idx !== faqs.length - 1 && <Divider my={2} />}
          </Box>
        ))}
      </Accordion>
    </Box>
  );
}

function Footer() {
  return (
    <Box as="footer" mt={8} py={3} textAlign="center">
      <Stack direction="row" spacing={6} justify="center" mb={2}>
        <IconButton as="a" href="https://twitter.com/iamamanchhetri" target="_blank" rel="noopener noreferrer" aria-label="Twitter" icon={<FaTwitter />} size="lg" variant="ghost" color={useColorModeValue('gray.800', 'gray.100')} _hover={{ color: 'gray.600' }} />
        <IconButton as="a" href="https://github.com/aman-chhetri" target="_blank" rel="noopener noreferrer" aria-label="GitHub" icon={<FaGithub />} size="lg" variant="ghost" color={useColorModeValue('gray.800', 'gray.100')} _hover={{ color: 'gray.600' }} />
        <IconButton as="a" href="https://linkedin.com/in/amankshetri" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" icon={<FaLinkedin />} size="lg" variant="ghost" color={useColorModeValue('gray.800', 'gray.100')} _hover={{ color: 'gray.600' }} />
        <IconButton as="a" href="https://amankshetri.com.np/" target="_blank" rel="noopener noreferrer" aria-label="Link" icon={<FaChrome />} size="lg" variant="ghost" color={useColorModeValue('gray.800', 'gray.100')} _hover={{ color: 'gray.600' }} />
      </Stack>
      <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')} mt={2}>
        Built with <span style={{ color: '#e94560', fontWeight: 700 }}>&hearts;</span> by Aman
      </Text>
    </Box>
  );
}

function App() {
  const location = useLocation();
  const [summary, setSummary] = useState("");
  const [pending, setPending] = useState(false);
  const [fileName, setFileName] = useState("");
  const [charCount, setCharCount] = useState(0);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const MAX_CHARS = 10000;

  const extractTextFromPDF = async (arrayBuffer) => {
    try {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map(item => item.str);
        text += strings.join(' ') + '\n';
      }
      return text;
    } catch (error) {
      throw error;
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setFileName(file.name);
    setPending(true);
    try {
      let text = "";
      const fileType = file.name.split('.').pop().toLowerCase();
      if (fileType === 'txt') {
        text = await file.text();
      } else if (fileType === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        text = await extractTextFromPDF(arrayBuffer);
      } else if (fileType === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else {
        toast({ status: 'error', title: 'Unsupported file type', description: 'Please upload .txt, .pdf, or .docx files.' });
        return;
      }
      if (textareaRef.current) {
        textareaRef.current.value = text;
      }
    } catch (error) {
      toast({ status: 'error', title: 'Error reading file', description: error.message });
    } finally {
      setPending(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const resetForm = () => {
    setSummary("");
    setFileName("");
    if (textareaRef.current) {
      textareaRef.current.value = "";
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setCharCount(text.length);
    } else {
      e.target.value = text.slice(0, MAX_CHARS);
      setCharCount(MAX_CHARS);
    }
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get("text");
    if (!text.trim()) {
      toast({ status: 'warning', title: 'No text', description: 'Please enter some text or upload a file!' });
      return;
    }
    if (text.trim().length < 50) {
      toast({ status: 'warning', title: 'Text too short', description: 'Please enter longer text!' });
      return;
    }
    const prompt = `Summarize the following text: ${text}`;
    setPending(true);
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1-zero:free",
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
          }),
        }
      );
      if (!response.ok) {
        throw new Error("API request failed");
      }
      const data = await response.json();
      const cleanedSummary = data.choices[0].message.content
        .replace(/\\boxed\{\s*"/g, '')
        .replace(/"\s*\}/g, '')
        .replace(/\\boxed\{/g, '')
        .replace(/\}/g, '')
        .replace(/^"/, '')
        .replace(/"$/, '')
        .replace(/^```/g, '')
        .replace(/```$/g, '')
        .replace(/^text\s*/g, '')
        .replace(/\s*text\s*$/g, '')
        .replace(/\s*text\s*/g, ' ')
        .trim();
      setSummary(cleanedSummary);
    } catch (error) {
      toast({ status: 'error', title: 'Failed to summarize', description: 'Check console for details.' });
    } finally {
      setPending(false);
    }
  }

  const formattedSummary = summary
    .split("\n")
    .map((p, index) => <Text key={index} mb={4}>{p}</Text>);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(summary);
      toast({ status: 'success', title: 'Copied to clipboard!' });
    } catch (err) {
      toast({ status: 'error', title: 'Failed to copy' });
    }
  }

  function downloadText() {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "summary.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Box minH="100vh" display="flex" flexDirection="column" bg={useColorModeValue('gray.100', 'gray.900')}>
        <Flex as="nav" align="center" justify="space-between" px={6} py={4} bg={useColorModeValue('white', 'gray.800')} boxShadow="sm" position="fixed" top={0} left={0} right={0} zIndex={1000}>
          <Flex align="center" fontWeight="bold" fontSize="xl" color={useColorModeValue('gray.700', 'white')}>
            <Box as={Link} to="/" display="flex" alignItems="center" _hover={{ textDecoration: 'none', color: 'blue.400' }}>
              <Logo />
              <Box as="span" ml={2}>TLDR.ai</Box>
            </Box>
          </Flex>
          <Flex align="center" gap={4}>
            <Button as={Link} to="/" variant="ghost"
              color={location.pathname === '/' ? 'blue.400' : useColorModeValue('gray.700', 'gray.200')}
              fontWeight={location.pathname === '/' ? 'bold' : 'normal'} px={3}
              _hover={{ color: 'blue.300' }}>
              Home
            </Button>
            <Button as={Link} to="/about" variant="ghost"
              color={location.pathname === '/about' ? 'blue.400' : useColorModeValue('gray.700', 'gray.200')}
              fontWeight={location.pathname === '/about' ? 'bold' : 'normal'} px={3}
              _hover={{ color: 'blue.300' }}>
              About
            </Button>
            <Button as={Link} to="/faq" variant="ghost"
              color={location.pathname === '/faq' ? 'blue.400' : useColorModeValue('gray.700', 'gray.200')}
              fontWeight={location.pathname === '/faq' ? 'bold' : 'normal'} px={3}
              _hover={{ color: 'blue.300' }}>
              FAQ
            </Button>
            <IconButton
              aria-label="Toggle dark mode"
              icon={colorMode === 'dark' ? <FaSun /> : <FaMoon />}
              onClick={toggleColorMode}
              variant="ghost"
              color={useColorModeValue('gray.700', 'yellow.300')}
            />
          </Flex>
        </Flex>
        <Box flex="1 0 auto" pt={24}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </Box>
      </Box>
      {location.pathname === '/' && <Footer />}
    </>
  );
}

export default App; 