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

function BatteryForm() {
  const { addFormData } = useContext(DataContext); // Accessing context to store form data

  const [make, setMake] = useState('');
  const [replacementDate, setReplacementDate] = useState('');
  const [voltage, setVoltage] = useState('');
  const [waterLevel, setWaterLevel] = useState('');
  const [damage, setDamage] = useState('');
  const [leakRust, setLeakRust] = useState('');
  const [overallSummary, setOverallSummary] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  const fields = {
    'make': setMake,
    'replacementdate': setReplacementDate,
    'voltage': setVoltage,
    'waterlevel': setWaterLevel,
    'damage': setDamage,
    'leakrust': setLeakRust,
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
  }, [make, replacementDate, voltage, waterLevel, damage, leakRust, overallSummary]);

  const validateForm = () => {
    const isValid = make.trim() !== '' &&
                    replacementDate.trim() !== '' &&
                    voltage.trim() !== '' &&
                    waterLevel.trim() !== '' &&
                    damage.trim() !== '' &&
                    leakRust.trim() !== '' &&
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
      "make": make,
      "replacementDate": replacementDate,
      "voltage": voltage,
      "waterLevel": waterLevel,
      "damage": damage,
      "leakRust": leakRust,
      "overallSummary": overallSummary
    }
    
    console.log('Form submitted:', formData);
    addFormData(formData); // Store form data in context
  
    navigate(parentPath); // Navigate to the parent path
  };

  const generatePdf = () => {
    if (!isFormValid) {
      alert('Please fill all the fields before generating the PDF.');
      return;
    }

    const doc = new jsPDF();
    const tableColumn = ["Field", "Value"];
    const tableRows = [
      ["Make", make],
      ["Replacement Date", replacementDate],
      ["Voltage", voltage],
      ["Water Level", waterLevel],
      ["Damage", damage],
      ["Leak/Rust", leakRust],
      ["Overall Summary", overallSummary],
    ];

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 10,
    });

    doc.save('battery_inspection.pdf');
  };

  return (
    <>
    <Heading mt = "30px" ml="480px">Enter details related to Battery</Heading>

    <Container w="300px" centerContent mt="100px">
      <Box p={4} w="500px" borderWidth="1px" borderRadius="md">
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl id="make">
              <FormLabel>Make</FormLabel>
              <Input
                type="text"
                value={make}
                onChange={(e) => setMake(e.target.value)}
              />
            </FormControl>
            <FormControl id="replacementDate">
              <FormLabel>Replacement Date</FormLabel>
              <Input
                type="date"
                value={replacementDate}
                onChange={(e) => setReplacementDate(e.target.value)}
              />
            </FormControl>
            <FormControl id="voltage">
              <FormLabel>Voltage</FormLabel>
              <Input
                type="text"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
              />
            </FormControl>
            <FormControl id="waterLevel">
              <FormLabel>Water Level</FormLabel>
              <Select
                value={waterLevel}
                onChange={(e) => setWaterLevel(e.target.value)}
              >
                <option value="">Select</option>
                <option value="good">Good</option>
                <option value="ok">Ok</option>
                <option value="low">Low</option>
              </Select>
            </FormControl>
            <FormControl id="damage">
              <FormLabel>Damage</FormLabel>
              <Select
                value={damage}
                onChange={(e) => setDamage(e.target.value)}
              >
                <option value="">Select</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </Select>
            </FormControl>
            <FormControl id="leakRust">
              <FormLabel>Leak/Rust</FormLabel>
              <Select
                value={leakRust}
                onChange={(e) => setLeakRust(e.target.value)}
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

export default BatteryForm;
