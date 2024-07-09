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
  Heading
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import DataContext from '../DataContext';


function TiresForm() {
  const { addFormData } = useContext(DataContext); // Accessing context to store form data

  const [leftFrontPressure, setLeftFrontPressure] = useState('');
  const [rightFrontPressure, setRightFrontPressure] = useState('');
  const [leftRearPressure, setLeftRearPressure] = useState('');
  const [rightRearPressure, setRightRearPressure] = useState('');
  const [leftFrontCondition, setLeftFrontCondition] = useState('');
  const [rightFrontCondition, setRightFrontCondition] = useState('');
  const [leftRearCondition, setLeftRearCondition] = useState('');
  const [rightRearCondition, setRightRearCondition] = useState('');
  const [overallSummary, setOverallSummary] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  const currentPath = useLocation().pathname;
  const parentPath = currentPath.split('/').slice(0, -1).join('/'); 

  const fields = {
    'leftfrontpressure': setLeftFrontPressure,
    'rightfrontpressure': setRightFrontPressure,
    'leftrearpressure': setLeftRearPressure,
    'rightrearpressure': setRightRearPressure,
    'leftfrontcondition': setLeftFrontCondition,
    'rightfrontcondition': setRightFrontCondition,
    'leftrearcondition': setLeftRearCondition,
    'rightrearcondition': setRightRearCondition,
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
  }, [leftFrontPressure, rightFrontPressure, leftRearPressure, rightRearPressure, leftFrontCondition, rightFrontCondition, leftRearCondition, rightRearCondition, overallSummary]);

  const validateForm = () => {
    const isValid = leftFrontPressure.trim() !== '' &&
                    rightFrontPressure.trim() !== '' &&
                    leftRearPressure.trim() !== '' &&
                    rightRearPressure.trim() !== '' &&
                    leftFrontCondition.trim() !== '' &&
                    rightFrontCondition.trim() !== '' &&
                    leftRearCondition.trim() !== '' &&
                    rightRearCondition.trim() !== '' &&
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
        "leftFrontPressure": leftFrontPressure,
        "rightFrontPressure": rightFrontPressure,
        "leftRearPressure": leftRearPressure,
        "rightRearPressure": rightRearPressure,
        "leftFrontCondition": leftFrontCondition,
        "rightFrontCondition": rightFrontCondition,
        "leftRearCondition": leftRearCondition,
        "rightRearCondition": rightRearCondition,
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
      ["Left Front Pressure", leftFrontPressure],
      ["Right Front Pressure", rightFrontPressure],
      ["Left Rear Pressure", leftRearPressure],
      ["Right Rear Pressure", rightRearPressure],
      ["Left Front Condition", leftFrontCondition],
      ["Right Front Condition", rightFrontCondition],
      ["Left Rear Condition", leftRearCondition],
      ["Right Rear Condition", rightRearCondition],
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
    <>
        <Heading mt = "30px" ml="500px">Enter details related to Tires</Heading>

    <Container w="300px" centerContent mt="30px">
      <Box p={4} w="500px" borderWidth="1px" borderRadius="md">
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl id="leftFrontPressure">
              <FormLabel>Left Front Pressure</FormLabel>
              <Input
                type="text"
                value={leftFrontPressure}
                onChange={(e) => setLeftFrontPressure(e.target.value)}
              />
            </FormControl>
            <FormControl id="rightFrontPressure">
              <FormLabel>Right Front Pressure</FormLabel>
              <Input
                type="text"
                value={rightFrontPressure}
                onChange={(e) => setRightFrontPressure(e.target.value)}
              />
            </FormControl>
            <FormControl id="leftRearPressure">
              <FormLabel>Left Rear Pressure</FormLabel>
              <Input
                type="text"
                value={leftRearPressure}
                onChange={(e) => setLeftRearPressure(e.target.value)}
              />
            </FormControl>
            <FormControl id="rightRearPressure">
              <FormLabel>Right Rear Pressure</FormLabel>
              <Input
                type="text"
                value={rightRearPressure}
                onChange={(e) => setRightRearPressure(e.target.value)}
              />
            </FormControl>
            <FormControl id="leftFrontCondition">
              <FormLabel>Left Front Condition</FormLabel>
              <Select
                value={leftFrontCondition}
                onChange={(e) => setLeftFrontCondition(e.target.value)}
              >
                <option value="">Select</option>
                <option value="good">Good</option>
                <option value="ok">Ok</option>
                <option value="needs replacement">Needs Replacement</option>
              </Select>
            </FormControl>
            <FormControl id="rightFrontCondition">
              <FormLabel>Right Front Condition</FormLabel>
              <Select
                value={rightFrontCondition}
                onChange={(e) => setRightFrontCondition(e.target.value)}
              >
                <option value="">Select</option>
                <option value="good">Good</option>
                <option value="ok">Ok</option>
                <option value="needs replacement">Needs Replacement</option>
              </Select>
            </FormControl>
            <FormControl id="leftRearCondition">
              <FormLabel>Left Rear Condition</FormLabel>
              <Select
                value={leftRearCondition}
                onChange={(e) => setLeftRearCondition(e.target.value)}
              >
                <option value="">Select</option>
                <option value="good">Good</option>
                <option value="ok">Ok</option>
                <option value="needs replacement">Needs Replacement</option>
              </Select>
            </FormControl>
            <FormControl id="rightRearCondition">
              <FormLabel>Right Rear Condition</FormLabel>
              <Select
                value={rightRearCondition}
                onChange={(e) => setRightRearCondition(e.target.value)}
              >
                <option value="">Select</option>
                <option value="good">Good</option>
                <option value="ok">Ok</option>
                <option value="needs replacement">Needs Replacement</option>
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
            <Button type="submit" colorScheme="blue" isDisabled={!isFormValid}>
              Submit
            </Button>
            <Button onClick={handleVoiceInput} colorScheme="green">
              {isRecognizing ? 'Stop Voice Input' : 'Start Voice Input'}
            </Button>
            <Button onClick={generatePdf} colorScheme="red" isDisabled={!isFormValid}>
              Generate PDF
            </Button>
          </Stack>
        </form>
      </Box>
    </Container>
    </>
  );
}

export default TiresForm;
