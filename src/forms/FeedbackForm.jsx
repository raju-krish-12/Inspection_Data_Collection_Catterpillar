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
  Heading,
  Select,
} from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import DataContext from '../DataContext';

function FeedbackForm() {
  const { addFormData } = useContext(DataContext); // Accessing context to store form data

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isRecognizing, setIsRecognizing] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const navigate = useNavigate();
  
  const currentPath = useLocation().pathname;
  const parentPath = currentPath.split('/').slice(0, -1).join('/'); 

  const fields = {
    'name': setName,
    'email': setEmail,
    'rating': setRating,
    'feedbackmessage': setFeedbackMessage,
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
  }, [name, email, rating, feedbackMessage]);

  const validateForm = () => {
    const isValid = name.trim() !== '' &&
                    email.trim() !== '' &&
                    rating.trim() !== '' &&
                    feedbackMessage.trim() !== '';
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
      "name" : name,
      "email": email, 
      "rating": rating,
      "feedbackMessage": feedbackMessage
    }
    console.log('Form submitted:', formData);
    addFormData(formData); // Store form data in context

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
      ["Name", name],
      ["Email", email],
      ["Rating", rating],
      ["Feedback Message", feedbackMessage],
    ];

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 10,
    });

    doc.save('customer_feedback.pdf');
  };

  return (
    <>
        <Heading mt = "30px" ml="480px">Enter your feedback</Heading>

    <Container w="300px" centerContent mt="100px">
      <Box p={4} w="500px" borderWidth="1px" borderRadius="md">
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <FormControl id="name">
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="rating">
              <FormLabel>Rating</FormLabel>
              <Select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">Select</option>
                <option value="1">1 - Very Poor</option>
                <option value="2">2 - Poor</option>
                <option value="3">3 - Average</option>
                <option value="4">4 - Good</option>
                <option value="5">5 - Excellent</option>
              </Select>
            </FormControl>
            <FormControl id="feedbackMessage">
              <FormLabel>Feedback Message</FormLabel>
              <Textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
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

export default FeedbackForm;
