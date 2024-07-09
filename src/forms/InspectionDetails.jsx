import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  FormLabel,
  Container,
  Input,
  Button,
  Stack,
  Heading,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import DataContext from '../DataContext';

function InspectionDetails() {
  const [truckSerialNo, setTruckSerialNo] = useState('');
  const [truckModel, setTruckModel] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [catCustomerId, setCatCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();

  const fields = {
    'truckserialnumber': setTruckSerialNo, 
    'truckmodel': setTruckModel,
    'dateandtime': setDateTime,
    'catcustomerid': setCatCustomerId,
    'customername': setCustomerName,
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
      console.log("Field Name: ${fieldName}, Value: ${value}");

      if (fields[fieldName]) {
        fields[fieldName](value);
        validateForm();
      } else {
        console.error("No matching field found for field name: ${fieldName}");
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
  }, [truckSerialNo, truckModel, dateTime, catCustomerId, customerName]);

  const validateForm = () => {
    const isValid = truckSerialNo.trim() !== '' &&
                    truckModel.trim() !== '' &&
                    dateTime.trim() !== '' &&
                    catCustomerId.trim() !== '' &&
                    customerName.trim() !== '';
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
    console.log('Form submitted:', {
      truckSerialNo,
      truckModel,
      dateTime,
      catCustomerId,
      customerName,
    });

    let id = generateRandomId(10);
    navigate("/inspect/"+id);
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
      ["Truck Serial Number", truckSerialNo],
      ["Truck Model", truckModel],
      ["Date and Time", dateTime],
      ["CAT Customer ID", catCustomerId],
      ["Customer Name", customerName],
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
    <Heading mt = "30px" ml="480px">Enter details related to Inspection</Heading>

    <Container centerContent mt="30px">
      <Box p={4} w="500px" borderWidth="1px" borderRadius="md">
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl id="truckSerialNumber">
              <FormLabel>Truck Serial No</FormLabel>
              <Input
                type="text"
                value={truckSerialNo}
                onChange={(e) => setTruckSerialNo(e.target.value)}
              />
            </FormControl>
            <FormControl id="truckModel">
              <FormLabel>Truck Model</FormLabel>
              <Input
                type="text"
                value={truckModel}
                onChange={(e) => setTruckModel(e.target.value)}
              />
            </FormControl>
            <FormControl id="dateTime">
              <FormLabel>Date and Time</FormLabel>
              <Input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
              />
            </FormControl>
            <FormControl id="catCustomerId">
              <FormLabel>CAT Customer ID</FormLabel>
              <Input
                type="text"
                value={catCustomerId}
                onChange={(e) => setCatCustomerId(e.target.value)}
              />
            </FormControl>
            <FormControl id="customerName">
              <FormLabel>Customer Name</FormLabel>
              <Input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
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

export default InspectionDetails;
