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


function BrakesForm() {
  const { addFormData } = useContext(DataContext); // Accessing context to store form data

  const [fluidLevel, setFluidLevel] = useState('');
  const [frontCondition, setFrontCondition] = useState('');
  const [backCondition, setBackCondition] = useState('');
  const [emergencyBrake, setEmergencyBrake] = useState('');
  const [overallSummary, setOverallSummary] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  const fields = {
    'fluidlevel': setFluidLevel,
    'frontcondition': setFrontCondition,
    'backcondition': setBackCondition,
    'emergencybrake': setEmergencyBrake,
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
  }, [fluidLevel, frontCondition, backCondition, emergencyBrake, overallSummary]);

  const validateForm = () => {
    const isValid = fluidLevel.trim() !== '' &&
                    frontCondition.trim() !== '' &&
                    backCondition.trim() !== '' &&
                    emergencyBrake.trim() !== '' &&
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

  const currentPath = useLocation().pathname;
  const parentPath = currentPath.split('/').slice(0, -1).join('/'); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) {
      alert('Please fill all the fields before submitting.');
      return;
    }
    let formData = {
      "fluidLevel": fluidLevel,
      "frontCondition": frontCondition,
      "backCondition": backCondition,
      "emergencyBrake": emergencyBrake,
      "overallSummary": overallSummary
    }
    console.log('Form submitted:', formData);
    addFormData(formData);

    navigate(parentPath); // Navigate to the parent path
  };

  const generateRandomId = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
  
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  
    return result;
  };

  const generatePdf = () => {
    if (!isFormValid) {
      alert('Please fill all the fields before generating the PDF.');
      return;
    }

    const doc = new jsPDF();
    const tableColumn = ["Field", "Value"];
    const tableRows = [
      ["Fluid Level", fluidLevel],
      ["Front Condition", frontCondition],
      ["Back Condition", backCondition],
      ["Emergency Brake", emergencyBrake],
      ["Overall Summary", overallSummary],
    ];

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 10,
    });

    doc.save('brakes_inspection.pdf');
  };

  return (
    <>
        <Heading mt = "30px" ml="480px">Enter details related to Brakes</Heading>

    <Container w="300px" centerContent mt="100px">
      <Box p={4} w="500px" borderWidth="1px" borderRadius="md">
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl id="fluidLevel">
              <FormLabel>Fluid Level</FormLabel>
              <Select
                value={fluidLevel}
                onChange={(e) => setFluidLevel(e.target.value)}
              >
                <option value="">Select</option>
                <option value="good">Good</option>
                <option value="ok">Ok</option>
                <option value="low">Low</option>
              </Select>
            </FormControl>
            <FormControl id="frontCondition">
              <FormLabel>Front Condition</FormLabel>
              <Select
                value={frontCondition}
                onChange={(e) => setFrontCondition(e.target.value)}
              >
                <option value="">Select</option>
                <option value="good">Good</option>
                <option value="ok">Ok</option>
                <option value="needsreplacement">Needs Replacement</option>
              </Select>
            </FormControl>
            <FormControl id="backCondition">
              <FormLabel>Back Condition</FormLabel>
              <Select
                value={backCondition}
                onChange={(e) => setBackCondition(e.target.value)}
              >
                <option value="">Select</option>
                <option value="good">Good</option>
                <option value="ok">Ok</option>
                <option value="needsreplacement">Needs Replacement</option>
              </Select>
            </FormControl>
            <FormControl id="emergencyBrake">
              <FormLabel>Emergency Brake</FormLabel>
              <Select
                value={emergencyBrake}
                onChange={(e) => setEmergencyBrake(e.target.value)}
              >
                <option value="">Select</option>
                <option value="good">Good</option>
                <option value="ok">Ok</option>
                <option value="needsreplacement">Needs Replacement</option>
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

export default BrakesForm;
