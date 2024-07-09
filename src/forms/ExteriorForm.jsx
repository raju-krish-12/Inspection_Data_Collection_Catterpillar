import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Container,
  Input,
  Button,
  Stack,
  Textarea,
  Select,
  Heading,
  IconButton,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { FaMicrophone } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import DataContext from '../DataContext';

function ExteriorForm() {
  const { addFormData } = useContext(DataContext); // Accessing context to store form data

  const [rustDentDamage, setRustDentDamage] = useState('');
  const [oilLeak, setOilLeak] = useState('');
  const [overallSummary, setOverallSummary] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();
  
  const currentPath = useLocation().pathname;
  const parentPath = currentPath.split('/').slice(0, -1).join('/'); 

  const fields = {
    'rustdentdamage': setRustDentDamage,
    'oilleak': setOilLeak,
    'overallsummary': setOverallSummary,
  };

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.continuous = true;
  recognition.interimResults = false;

  useEffect(() => {
    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      console.log('Recognized: ' + transcript);

      const words = transcript.split(' ');
      const value = words.pop(); // Last word as value
      const fieldName = words.join(''); // Rest as field name
      console.log(`Field Name: ${fieldName}, Value: ${value}`);

      if (fields[fieldName]) {
        fields[fieldName](value);
        validateForm();
      } else {
        console.error(`No matching field found for field name: ${fieldName}`);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error detected: ' + event.error);
      if (event.error === 'no-speech' || event.error === 'network') {
        recognition.stop();
        recognition.start();
      }
    };

    recognition.onend = () => {
      if (isRecognizing) {
        recognition.start();
      }
    };

    return () => {
      recognition.stop();
    };
  }, [isRecognizing]);

  useEffect(() => {
    validateForm();
  }, [rustDentDamage, oilLeak, overallSummary]);

  const validateForm = () => {
    const isValid = rustDentDamage.trim() !== '' &&
                    oilLeak.trim() !== '' &&
                    overallSummary.trim() !== '';
    setIsFormValid(isValid);
  };

  const handleVoiceInput = () => {
    if (isRecognizing) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsRecognizing(!isRecognizing);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert('Please fill all the fields before submitting.');
      return;
    }
    let formData = {
      "rustDentDamage": rustDentDamage,
      "oilLeak": oilLeak,
      "overallSummary": overallSummary
    }
    
    console.log('Form submitted:', formData);
    addFormData(formData);

    navigate(parentPath);
  };

  const generatePdf = () => {
    if (!isFormValid) {
      alert('Please fill all the fields before generating the PDF.');
      return;
    }

    const doc = new jsPDF();
    const tableColumn = ["Field", "Value"];
    const tableRows = [
      ["Rust/Dent/Damage to Exterior", rustDentDamage],
      ["Oil Leak", oilLeak],
      ["Overall Summary", overallSummary],
    ];

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 10,
    });

    doc.save('output.pdf');
  };

  return (
    <Flex direction="column" alignItems="flex-start" p={4} w="100%">
      <Flex justify="flex-end" w="100%" mb={4}>
        <IconButton
          icon={<FaMicrophone />}
          aria-label={isRecognizing ? 'Stop Voice Input' : 'Start Voice Input'}
          size="lg"
          colorScheme={isRecognizing ? 'red' : 'green'}
          onClick={handleVoiceInput}
        />
      </Flex>
      <Container w="500px">
        <Box p={4} borderWidth="1px" borderRadius="md">
          <Heading mb={4}>Enter details related to the Exterior</Heading>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <FormControl id="rustDentDamage">
                <FormLabel>Rust/Dent/Damage to Exterior</FormLabel>
                <Select
                  value={rustDentDamage}
                  onChange={(e) => setRustDentDamage(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
              </FormControl>
              <FormControl id="oilLeak">
                <FormLabel>Oil Leak</FormLabel>
                <Select
                  value={oilLeak}
                  onChange={(e) => setOilLeak(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
              </FormControl>
              <FormControl id="overallSummary">
                <FormLabel>Overall Summary</FormLabel>
                <Textarea
                  value={overallSummary}
                  onChange={(e) => setOverallSummary(e.target.value)}
                  maxLength={1000}
                />
              </FormControl>
              <Flex justify="space-between" w="100%">
                <Stack direction="row">
                  <Button type="submit" colorScheme="blue" isDisabled={!isFormValid}>
                    Submit
                  </Button>
                  <Button onClick={generatePdf} colorScheme="red" isDisabled={!isFormValid}>
                    Generate PDF
                  </Button>
                </Stack>
              </Flex>
            </Stack>
          </form>
        </Box>
      </Container>
    </Flex>
  );
}

export default ExteriorForm;
