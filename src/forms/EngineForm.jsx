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


function EngineForm() {
  const { addFormData } = useContext(DataContext); // Accessing context to store form data

  const [rustDentDamage, setRustDentDamage] = useState('');
  const [oilCondition, setOilCondition] = useState('');
  const [oilColor, setOilColor] = useState('');
  const [fluidCondition, setFluidCondition] = useState('');
  const [fluidColor, setFluidColor] = useState('');
  const [oilLeak, setOilLeak] = useState('');
  const [overallSummary, setOverallSummary] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  const fields = {
    'rustdentdamage': setRustDentDamage,
    'oilcondition': setOilCondition,
    'oilcolor': setOilColor,
    'fluidcondition': setFluidCondition,
    'fluidcolor': setFluidColor,
    'oilleak': setOilLeak,
    'overallsummary': setOverallSummary,
  };

  const currentPath = useLocation().pathname;
  const parentPath = currentPath.split('/').slice(0, -1).join('/'); 

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
  }, [rustDentDamage, oilCondition, oilColor, fluidCondition, fluidColor, oilLeak, overallSummary]);

  const validateForm = () => {
    const isValid = rustDentDamage.trim() !== '' &&
                    oilCondition.trim() !== '' &&
                    oilColor.trim() !== '' &&
                    fluidCondition.trim() !== '' &&
                    fluidColor.trim() !== '' &&
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
        "oilCondition": oilCondition,
        "oilColor": oilColor,
        "fluidCondition": fluidCondition,
        "fluidColor": fluidColor,
        "oilLeak": oilLeak,
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
      ["Rust/Dent/Damage", rustDentDamage],
      ["Oil Condition", oilCondition],
      ["Oil Color", oilColor],
      ["Fluid Condition", fluidCondition],
      ["Fluid Color", fluidColor],
      ["Oil Leak", oilLeak],
      ["Overall Summary", overallSummary],
    ];

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 10,
    });

    doc.save('engine_inspection.pdf');
  };

  return (
    <>
        <Heading mt = "30px" ml="480px">Enter details related to Engine</Heading>

    <Container w="300px" centerContent mt="100px">
      <Box p={4} w="500px" borderWidth="1px" borderRadius="md">
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl id="rustDentDamage">
              <FormLabel>Rust/Dent/Damage</FormLabel>
              <Select
                value={rustDentDamage}
                onChange={(e) => setRustDentDamage(e.target.value)}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Select>
            </FormControl>
            <FormControl id="oilCondition">
              <FormLabel>Oil Condition</FormLabel>
              <Select
                value={oilCondition}
                onChange={(e) => setOilCondition(e.target.value)}
              >
                <option value="">Select</option>
                <option value="good">Good</option>
                <option value="bad">Bad</option>
              </Select>
            </FormControl>
            <FormControl id="oilColor">
              <FormLabel>Oil Color</FormLabel>
              <Select
                value={oilColor}
                onChange={(e) => setOilColor(e.target.value)}
              >
                <option value="">Select</option>
                <option value="clean">Clean</option>
                <option value="brown">Brown</option>
                <option value="black">Black</option>
              </Select>
            </FormControl>
            <FormControl id="fluidCondition">
              <FormLabel>Fluid Condition</FormLabel>
              <Select
                value={fluidCondition}
                onChange={(e) => setFluidCondition(e.target.value)}
              >
                <option value="">Select</option>
                <option value="good">Good</option>
                <option value="bad">Bad</option>
              </Select>
            </FormControl>
            <FormControl id="fluidColor">
              <FormLabel>Fluid Color</FormLabel>
              <Select
                value={fluidColor}
                onChange={(e) => setFluidColor(e.target.value)}
              >
                <option value="">Select</option>
                <option value="clean">Clean</option>
                <option value="brown">Brown</option>
                <option value="black">Black</option>
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

export default EngineForm;
